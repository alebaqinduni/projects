# Lahore Exchange — Currency Board

A full-stack currency converter: a static frontend (`index.html`) and an
Express API (`server/`) that fetches and caches live exchange rates.

The frontend works with **no backend at all** — it calls a free public rate
API directly. The backend is there for when you want your own rate-limited,
cached, swappable-provider API sitting in between (recommended if you plan to
put real traffic through this).

## Project structure

```
currency-app/
├── index.html        the app (frontend)
├── manifest.json      PWA manifest — lets phones "install" the app
├── sw.js               service worker — offline shell + caching
├── icon.svg            app icon
└── server/
    ├── index.js         Express API (rates + convert endpoints)
    └── package.json
```

## 1. Run it locally

**Frontend only (fastest):**
Just open `index.html` in a browser. It calls open.er-api.com directly.

**With the backend:**
```bash
cd server
npm install
npm start          # runs on http://localhost:4000
```
Then in `index.html`, set:
```js
const API_BASE = 'http://localhost:4000';
```

## 2. Deploy the backend

Any Node host works. Two easy free-tier options:

**Render**
1. Push this folder to a GitHub repo.
2. Render.com → New → Web Service → connect the repo.
3. Root directory: `server`. Build command: `npm install`. Start command: `npm start`.
4. Deploy — you'll get a URL like `https://lahore-exchange-api.onrender.com`.

**Railway**
1. railway.app → New Project → Deploy from GitHub repo.
2. Set root directory to `server`.
3. Railway auto-detects Node and deploys — copy the generated URL.

Once deployed, put that URL into `API_BASE` in `index.html`.

## 3. Deploy the frontend

Since it's static, any static host works:

**Vercel**
```bash
npm i -g vercel
cd currency-app
vercel deploy --prod
```

**Netlify** — drag the `currency-app` folder onto app.netlify.com/drop, or:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

**GitHub Pages** — push to a repo, enable Pages on the `main` branch, root folder.

You'll end up with a real HTTPS URL, e.g. `https://board-fx.vercel.app`.

## 4. Get it onto a phone

You have three levels of "deploy to phone," from easiest to most involved:

### A. Install as an app (PWA) — no app store, ready today
Because `manifest.json` and `sw.js` are already wired in:
1. Open your deployed URL on the phone's browser (Chrome on Android, Safari on iOS).
2. **Android/Chrome:** tap the menu → "Install app" (or you'll see an automatic install prompt).
3. **iPhone/Safari:** tap Share → "Add to Home Screen."
4. It now opens full-screen from the home screen, with its own icon, no browser
   bar — functionally an app. Works offline for the UI shell; rates need a connection.

This is the right choice for personal use or sharing with friends/family — no
app store review, updates instantly when you redeploy.

### B. Wrap it as a real installable binary (still no native rewrite)
Use **Capacitor** to wrap the same web app into an actual Android/iOS project:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Lahore Exchange" "com.yourname.exchange"
npx cap add android
npx cap add ios
npx cap copy
```
Then open the generated project in Android Studio (`npx cap open android`) or
Xcode (`npx cap open ios`) to run it on a device or build a release binary.

### C. Publish to app stores
Once you have the Capacitor project building fine on a device:
- **Android:** build a signed `.aab` in Android Studio, create a Google Play
  Console account ($25 one-time), upload, fill in the store listing, submit for review.
- **iOS:** build/archive in Xcode, need an Apple Developer account
  ($99/year), upload via Xcode or Transporter, submit through App Store Connect.

Both stores review submissions before they go live (hours to a few days).

## Notes

- The public rate API (`open.er-api.com`) is free, keyless, and refreshes
  roughly hourly — fine for personal/reference use, not for anything
  transactional.
- The backend cache is in-memory and resets on restart/redeploy; swap in
  Redis if you need it to persist across instances.
- No API keys, secrets, or user data are collected anywhere in this project.
