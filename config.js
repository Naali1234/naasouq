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
  siteUrl: "",

  // 4) Paid plans — everything is ready; change these when you want to start charging.
  payments: {
    freeForEveryone: true,     // true = all ads free (now).  false = start the paid plans below
    freeAdsPerUser: 5,         // free ads each user gets before paying
    packPriceUSD: 5,           // price of one pack, in US dollars
    packPosts: 20,             // posts in one pack
    packValidDays: 90,         // pack is valid this many days after you approve it

    link: "",                  // your payment link, e.g. "https://link.payoneer.com/..."  (leave "" if none)
    qrImage: "",               // file name of your QR code picture uploaded to GitHub, e.g. "payment-qr.png"
    instructions: ""           // any extra text, e.g. "Bank: QNB  Account name: ...  IBAN: ..."
  }
};

// --- do not change below this line ---
window.__nxReady = new Promise(function (r) { window.__nxReadyResolve = r; });
window.claude = { use: function (name) { return window.__nxReady.then(function (api) { return api.use(name); }); } };
