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

  // Block any audio requests
  if (pathname.endsWith('.mp3') || pathname.endsWith('.wav') || pathname.endsWith('.ogg') || pathname.endsWith('.m4a')) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Audio removed');
    return;
  }

  let filePath = '';
  const lowerCleanPath = cleanPath.toLowerCase();

  // Block removed project pages completely from the entire website
  const REMOVED_ROUTES = [
    '/studio',
    '/insights',
    '/contact',
    '/legal/privacy-policy',
    '/legal/terms-of-service',
    '/404',
  ];
  if (REMOVED_ROUTES.some(r => lowerCleanPath === r || lowerCleanPath.startsWith(r + '/'))) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 - Page Not Found</title></head><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif"><h1>404 - Page Not Found</h1></body></html>');
    return;
  }

  const REMOVED_PROJECTS = [
    '/projects/studio-24',
    '/projects/studio24',
    '/projects/blackline',
    '/projects/new-damage',
    '/projects/newdamage',
  ];

  if (REMOVED_PROJECTS.some(p => lowerCleanPath === p || lowerCleanPath.startsWith(p + '/'))) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 - Project Not Found</title><meta name="robots" content="noindex"><style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0}a{color:#0099ff;text-decoration:none;margin-top:20px;font-weight:bold}</style></head><body><h1>404 - Project Not Found</h1><p>The requested project has been removed.</p><a href="/">Return to Home</a></body></html>');
    return;
  }

  // Explicit route matching
  if (cleanPath === '/' || cleanPath === '/index.html') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (cleanPath === '/home-gallery' || cleanPath === '/home-loop' || cleanPath === '/home-spiral') {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  } else {
    // Check if the requested file exists directly
    const directPath = path.join(__dirname, pathname);
    const publicPath = path.join(__dirname, 'public', pathname);

    if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
      filePath = directPath;
    } else if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      filePath = publicPath;
    } else if (!path.extname(pathname)) {
      // Check for public/<route>.html
      const namedHtml = path.join(__dirname, 'public', `${cleanPath.slice(1)}.html`);
      if (fs.existsSync(namedHtml) && fs.statSync(namedHtml).isFile()) {
        filePath = namedHtml;
      } else {
        // SPA route fallback
        filePath = path.join(__dirname, 'public', 'index.html');
      }
    }
  }

  if (filePath && fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
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

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
