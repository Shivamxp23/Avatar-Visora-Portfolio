const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  let filePath = path.join(__dirname, reqPath);
  
  fs.stat(filePath, (err, stats) => {
    if (err || stats.isDirectory()) {
      // Check if index.html exists in subdirectory
      const indexInSubdir = path.join(filePath, 'index.html');
      if (fs.existsSync(indexInSubdir) && fs.statSync(indexInSubdir).isFile()) {
        filePath = indexInSubdir;
      } else {
        // SPA Fallback: serve root index.html
        filePath = path.join(__dirname, 'index.html');
      }
    }
    
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }
      
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Development server running at http://localhost:${PORT}`);
});
