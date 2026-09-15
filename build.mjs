// Build script for Vercel deployment
// Copies asset directories from project root into public/ so Vercel can serve them
import fs from 'node:fs';
import path from 'node:path';

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      // Don't overwrite if dest already exists and is newer
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const assetDirs = [
  'framerusercontent.com',
  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'app.framerstatic.com',
];

for (const dir of assetDirs) {
  if (fs.existsSync(dir)) {
    const dest = path.join('public', dir);
    console.log(`Copying ${dir}/ → public/${dir}/`);
    copyDirSync(dir, dest);
  }
}

// Copy favicon.ico into public/ if not already there
if (fs.existsSync('favicon.ico') && !fs.existsSync('public/favicon.ico')) {
  fs.copyFileSync('favicon.ico', 'public/favicon.ico');
  console.log('Copied favicon.ico → public/favicon.ico');
}

console.log('Build complete!');
