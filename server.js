import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // Normalize pathname without trailing slash for route matching
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  let filePath = '';
  const lowerCleanPath = cleanPath.toLowerCase();

  // Explicit route matching
  if (cleanPath === '/' || cleanPath === '/index.html') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (cleanPath === '/home-gallery' || cleanPath === '/ugc') {
    filePath = path.join(__dirname, 'public', 'home-gallery.html');
  } else if (cleanPath === '/ad-films' || cleanPath === '/adfilms') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (cleanPath.startsWith('/projects/')) {
    // Route directly to public/projects/<slug>.html if it exists
    const slug = cleanPath.replace(/^\/projects\//, '').toLowerCase().replace(/\.html$/, '');
    const projectHtml = path.join(__dirname, 'public', 'projects', `${slug}.html`);
    if (fs.existsSync(projectHtml) && fs.statSync(projectHtml).isFile()) {
      filePath = projectHtml;
    }
  } else {
    // Check if the requested file exists directly
    const directPath = path.join(__dirname, pathname);
    const publicPath = path.join(__dirname, 'public', pathname);

    if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
      filePath = directPath;
    } else if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      filePath = publicPath;
    } else if (pathname.startsWith('/assets/projects/')) {
      const filename = path.basename(pathname);
      const lowerName = filename.toLowerCase();
      const candidates = [
        path.join(__dirname, 'public', 'assets', 'projects', filename),
        path.join(__dirname, 'public', 'assets', 'projects', lowerName),
        path.join(__dirname, 'assets', 'projects', filename),
        path.join(__dirname, 'assets', 'projects', lowerName),
        path.join(__dirname, 'Projects', 'Ad Films', filename),
        path.join(__dirname, 'Projects', 'Ad Films', 'Thumbnails', filename),
        path.join(__dirname, 'Projects', 'UGC', filename),
        path.join(__dirname, 'Projects', 'UGC', 'Thumbnails', filename),
        path.join(__dirname, 'Projects', 'Jingles', filename),
      ];
      // Check aliases for Jingles and UGC
      if (lowerName === 'b-tex.wav' || lowerName === 'btex.wav') {
        candidates.push(path.join(__dirname, 'Projects', 'Jingles', 'B tex.WAV'));
      }
      if (lowerName === 'madhuram.wav') {
        candidates.push(path.join(__dirname, 'Projects', 'Jingles', 'madhuram.wav'));
      }
      if (lowerName === 'peanutji.mp3') {
        candidates.push(path.join(__dirname, 'Projects', 'Jingles', 'Peanutji.MP3'));
      }
      if (lowerName === 'clarion-inn.mp4') {
        candidates.push(path.join(__dirname, 'Projects', 'UGC', 'Clarion inn .mp4'));
      }
      if (lowerName === 'glenn.mp4') {
        candidates.push(path.join(__dirname, 'Projects', 'UGC', 'Glen.mp4'));
      }
      for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
          filePath = cand;
          break;
        }
      }
    }
    
    if (!filePath && !path.extname(pathname)) {
      // Check for public/<route>.html
      const namedHtml = path.join(__dirname, 'public', `${cleanPath.slice(1)}.html`);
      if (fs.existsSync(namedHtml) && fs.statSync(namedHtml).isFile()) {
        filePath = namedHtml;
      }
    }
  }

  if (filePath && fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range && (ext === '.mp4' || ext === '.webm' || ext === '.mp3' || ext === '.wav')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      fileStream.pipe(res);
      return;
    }

    const headers = {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes'
    };
    if (ext === '.html' || ext === '.js' || ext === '.mjs' || ext === '.css') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback proxy for CDN assets (e.g. /framerusercontent.com/...)
  if (pathname.startsWith('/framerusercontent.com/') || pathname.startsWith('/events.framer.com/')) {
    const remoteHost = pathname.startsWith('/events.framer.com/') ? 'events.framer.com' : 'framerusercontent.com';
    const remotePath = pathname.replace(`/${remoteHost}`, '');
    const remoteUrl = `https://${remoteHost}${remotePath}`;

    const proxyReq = https.get(remoteUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (proxyRes) => {
      if (proxyRes.statusCode === 200) {
        const ext = path.extname(pathname).toLowerCase();
        const contentType = proxyRes.headers['content-type'] || MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });

        const savePath = path.join(__dirname, pathname);
        try {
          fs.mkdirSync(path.dirname(savePath), { recursive: true });
          const fileStream = fs.createWriteStream(savePath);
          proxyRes.pipe(fileStream);
        } catch (e) {
          // ignore write error
        }
        proxyRes.pipe(res);
      } else {
        res.writeHead(proxyRes.statusCode || 404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    });

    proxyReq.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Proxy error: ${err.message}`);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 - Page Not Found</title></head><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif"><h1>404 - Page Not Found</h1></body></html>');
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
