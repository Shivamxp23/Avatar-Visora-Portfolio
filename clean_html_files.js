import fs from 'node:fs';

const cssAndScript = `
<style id="removed-projects-filter">
.framer-rjguy, .framer-rcym12, .framer-1ixs3tg,
.framer-1fyi9v9-container, .framer-n49ur-container, .framer-1vt85ms-container,
a[href*="blackline"], a[href*="studio-24"], a[href*="studio24"], a[href*="new-damage"], a[href*="newdamage"] {
  display: none !important;
  pointer-events: none !important;
  visibility: hidden !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
<script id="removed-projects-purger">
(function() {
  const REMOVED = ['blackline', 'studio-24', 'studio24', 'new-damage', 'newdamage'];
  function purge() {
    document.querySelectorAll('a').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      const text = (a.innerText || '').toLowerCase().trim();
      if (REMOVED.some(r => href.includes(r) || text === r || text === r.replace('-', ' ') || text === r.replace('-', ''))) {
        const item = a.closest('.framer-rjguy, .framer-rcym12, .framer-1ixs3tg') || a;
        item.style.display = 'none';
        try { item.remove(); } catch(e) {}
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', purge);
  } else {
    purge();
  }
  const observer = new MutationObserver(purge);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
</script>
`;

for (const file of ['public/index.html', 'public/home-gallery.html', 'public/home-loop.html']) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('removed-projects-filter')) {
    content = content.replace('</head>', `${cssAndScript}\n</head>`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Already updated ${file}`);
  }
}
