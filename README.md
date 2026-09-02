# Avatar Visora — Portfolio

A WebGL-powered interactive portfolio website built with Vanilla JavaScript, Three.js, and Alpine.js.

## 🚀 Deploying to Vercel

This repository is pre-configured and 100% Vercel-ready.

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Keep the default settings (Framework Preset: *Other*, Root Directory: `./`).
5. Click **"Deploy"**.

### Option 2: Deploy using Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 💻 Local Development

Run the local server:
```bash
npm run dev
# or
node server.js
```

Open your browser at `http://localhost:3000`.

---

## 📁 Project Structure

```
├── assets/
│   ├── css/          # Stylesheets (style.css)
│   ├── font/         # PP Neue Montreal webfonts
│   ├── js/           # WebGL and interaction logic (main.js)
│   ├── texture/      # Grain and blur textures
│   ├── favicon.png   # Favicon asset
│   └── share-image.png # Open Graph social preview
├── index.html        # Main SPA HTML entrypoint
├── package.json      # Project metadata & npm scripts
├── server.js         # Lightweight local dev server
├── vercel.json       # Vercel SPA routing, rewrites & caching rules
└── robots.txt        # Search engine crawler permissions
```
