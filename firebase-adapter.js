// Naa Souq — connects the website to Firebase (database + sign-in).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc,
  onSnapshot, query, where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
  sendEmailVerification, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const C = window.NX_CONFIG;
const app = initializeApp(C.firebase);
const fs = getFirestore(app);
const auth = getAuth(app);

const CODE = { "permission-denied": "invalid_argument", "invalid-argument": "invalid_argument",
  "resource-exhausted": "quota_exceeded", "not-found": "invalid_argument" };
const err = e => ({ code: CODE[e && e.code] || "unavailable", message: (e && e.message) || "error" });
const meta = m => ({ fromCache: !!(m && m.fromCache), hasPendingWrites: !!(m && m.hasPendingWrites) });
const wrapDoc = s => ({ id: s.id, exists: s.exists(), data: () => (s.exists() ? s.data() : undefined), metadata: meta(s.metadata) });
const wrapQuery = s => ({ docs: s.docs.map(wrapDoc), size: s.size, empty: s.empty, metadata: meta(s.metadata), docChanges: () => [] });
const guard = p => p.catch(e => { throw err(e); });

function docRef(path) {
  const r = doc(fs, path);
  return {
    id: r.id, path,
    get: async () => wrapDoc(await guard(getDoc(r))),
    set: d => guard(setDoc(r, d)),
    update: d => guard(updateDoc(r, d)),
    delete: () => guard(deleteDoc(r)),
    onSnapshot: (next, onErr) => onSnapshot(r, s => next(wrapDoc(s)), e => onErr && onErr(err(e))),
    collection: p => colRef(path + "/" + p)
  };
}
function makeQuery(path, cons) {
  const q = () => query(collection(fs, path), ...cons);
  return {
    where: (f, op, v) => makeQuery(path, [...cons, where(f, op, v)]),
    orderBy: (f, d) => makeQuery(path, [...cons, orderBy(f, d || "asc")]),
    limit: n => makeQuery(path, [...cons, limit(n)]),
    get: async () => wrapQuery(await guard(getDocs(q()))),
    onSnapshot: (next, onErr) => onSnapshot(q(), s => next(wrapQuery(s)), e => onErr && onErr(err(e)))
  };
}
function colRef(path) {
  return Object.assign(makeQuery(path, []), {
    path,
    doc: id => docRef(id ? path + "/" + id : doc(collection(fs, path)).path),
    add: async d => { const r = await guard(addDoc(collection(fs, path), d)); return docRef(r.path); }
  });
}
const dbApi = { doc: docRef, collection: colRef };

// ---------- who is signed in ----------
let first = true, startUid = null;
const ready = new Promise(res => {
  onAuthStateChanged(auth, async u => {
    if (first) { first = false; startUid = u ? u.uid : null; res(u); return; }
    // signed in or out after the page loaded → save the name, then reload so everything refreshes
    if ((u ? u.uid : null) !== startUid) {
      if (u) { try { await setDoc(doc(fs, "profiles/" + u.uid), { name: u.displayName || (u.email || "").split("@")[0] }, { merge: true }); } catch (e) {} }
      location.reload();
    }
  });
});
const isAdminUser = u => !!(u && u.email && (u.emailVerified || u.providerData.some(p => p.providerId === "google.com")) &&
  (C.adminEmails || []).map(x => String(x).toLowerCase()).includes(u.email.toLowerCase()));

const userApi = {
  id: async () => { const u = await ready; return u ? u.uid : null; },
  isOwner: async () => isAdminUser(await ready),
  canEdit: async () => isAdminUser(await ready),
  can: async () => !!(await ready),
  me: async () => { const u = await ready; return u ? { id: u.uid, name: u.displayName || "", email: u.email || "" } : null; },
  profiles: async ids => {
    const out = {};
    await Promise.all((ids || []).map(async id => {
      try { const s = await getDoc(doc(fs, "profiles/" + id)); out[id] = { id, name: s.exists() ? (s.data().name || "") : "" }; }
      catch (e) { out[id] = { id, name: "" }; }
    }));
    return out;
  }
};

// ---------- sign-in actions used by the page ----------
window.nxSignInGoogle = async () => {
  const p = new GoogleAuthProvider();
  try { await signInWithPopup(auth, p); }
  catch (e) { if (e && (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment")) await signInWithRedirect(auth, p); else throw e; }
};
window.nxEmailAuth = async (email, pass, isNew, name) => {
  if (isNew) {
    const r = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) { try { await updateProfile(r.user, { displayName: name }); } catch (e) {} }
    try { await sendEmailVerification(r.user); } catch (e) {}
  } else {
    await signInWithEmailAndPassword(auth, email, pass);
  }
};
window.nxResetPassword = email => sendPasswordResetEmail(auth, email);
window.nxSignOut = () => signOut(auth);
window.nxCurrentUser = async () => { const u = await ready; return u ? { name: u.displayName || "", email: u.email || "" } : null; };

window.__nxReadyResolve({ use: async name => (name === "db" ? dbApi : name === "user" ? userApi : null) });
