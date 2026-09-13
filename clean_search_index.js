import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const baseDir = 'framerusercontent.com/sites/1UfZHGPLfx7SHOUvvJ36FC';
fs.mkdirSync(baseDir, { recursive: true });

function fetchAndClean(filename) {
  const url = `https://framerusercontent.com/sites/1UfZHGPLfx7SHOUvvJ36FC/${filename}`;
  https.get(url, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const removed = ['/projects/blackline', '/projects/studio-24', '/projects/new-damage'];
        if (Array.isArray(json)) {
          // If it's an array
          const cleaned = json.filter(item => {
            const str = JSON.stringify(item);
            return !removed.some(r => str.includes(r));
          });
          fs.writeFileSync(path.join(baseDir, filename), JSON.stringify(cleaned), 'utf8');
        } else if (typeof json === 'object') {
          // If it's an object with path keys
          for (const key of Object.keys(json)) {
            if (removed.some(r => key.toLowerCase().includes(r.replace('/projects/', '')))) {
              delete json[key];
              console.log(`Deleted key ${key} from ${filename}`);
            }
          }
          fs.writeFileSync(path.join(baseDir, filename), JSON.stringify(json), 'utf8');
        }
        console.log(`Saved clean ${filename}`);
      } catch (e) {
        console.error(`Error with ${filename}:`, e.message);
      }
    });
  });
}

fetchAndClean('searchIndex-LU1wJWmvohRL.json');
fetchAndClean('searchIndex-DyHOjcp4Ioou.json');
