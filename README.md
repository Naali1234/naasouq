# Naa Souq

Free classified-ads marketplace — buy & sell locally in your country. English + Arabic.

Runs for free on **GitHub Pages** (website) + **Firebase Spark plan** (database and sign-in).

## Files

| File | What it is |
|---|---|
| `index.html` | The whole website |
| `config.js` | **Your settings** — Firebase keys, admin email, site address |
| `firebase-adapter.js` | Connects the site to Firebase (no need to edit) |
| `firestore.rules` | Database security rules — paste into Firebase → Firestore → Rules |
| `manifest.json`, `sw.js` | Make the site installable as an app |
| `icons/`, `cats/` | Logo, icons and category pictures |

## Setup (one time)

1. **Firebase** (console.firebase.google.com): create a project → Firestore Database (production mode) → Authentication: enable **Google** and **Email/Password** → Authentication → Settings → Authorized domains → add `naali1234.github.io` → Project settings → add a **Web app** and copy its config.
2. Put the config and your admin email into `config.js`, and the same email into `firestore.rules`.
3. Firebase → Firestore Database → **Rules** → paste `firestore.rules` → **Publish**.
4. GitHub → this repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → **Save**.
5. Open `https://naali1234.github.io/naasouq/` after 1–2 minutes.

## Later (optional, paid)

- Own domain (e.g. naasouq.com): GitHub → Settings → Pages → Custom domain.
- Paid posting plans: set `FREE_LAUNCH=false` in `index.html` (needs server-side checks before going live).
