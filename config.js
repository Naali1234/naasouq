// ============================================================
//  Naa Souq — settings.  This is the ONLY file you need to edit.
// ============================================================
window.NX_CONFIG = {
  // 1) Paste your Firebase web app settings here
  //    (Firebase console → Project settings → Your apps → Web app → "SDK setup and configuration" → Config)
  firebase: {
    apiKey: "AIzaSyB6nVvLZ5FmYVWxTgHwFqrlyk6BkskfozM",
    authDomain: "naa-souq.firebaseapp.com",
    projectId: "naa-souq",
    storageBucket: "naa-souq.firebasestorage.app",
    messagingSenderId: "335295558615",
    appId: "1:335295558615:web:9a5dd34bcbc964f4621192",
    measurementId: "G-CKGX2HG22J"
  },

  // 2) The Google / email address(es) that get the Admin tab
  adminEmails: ["kapilak510@gmail.com"],

  // 3) The public address of the website (used for "Share" and "Copy link").
  //    Leave empty to use the address the site is opened from automatically.
  siteUrl: ""
};

// --- do not change below this line ---
window.__nxReady = new Promise(function (r) { window.__nxReadyResolve = r; });
window.claude = { use: function (name) { return window.__nxReady.then(function (api) { return api.use(name); }); } };
