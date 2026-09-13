import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

// --- 1. Modify BgXe2d9Y.mjs ---
const bgPath = 'framerusercontent.com/sites/1UfZHGPLfx7SHOUvvJ36FC/jyNUeqw5ud41m4Do_MalBt3XIxXbBViFIIaWaDMCRg8.BgXe2d9Y.mjs';
let bg = fs.readFileSync(bgPath, 'utf8');

const target1 = ',m(C.div,{className:`framer-rjguy`';
const target3 = 'm(C.div,{className:`framer-1ixs3tg`';
const target3End = '})})})})})})},t)))})})})})';

const bgStart = bg.indexOf(target1);
const bgIdx3 = bg.indexOf(target3);
if (bgStart !== -1 && bgIdx3 !== -1) {
  const bgEnd = bg.indexOf(target3End, bgIdx3) + target3End.length;
  bg = bg.slice(0, bgStart) + bg.slice(bgEnd);
  console.log('BgXe2d9Y.mjs: cut JSX successfully');
}

// Remove preloads for Ma, Na, Pa in BgXe2d9Y.mjs
bg = bg.replace(',s.preload(),c.preload(),l.preload()', '');
// Make query functions return empty
bg = bg.replace(/Ma=\(\)=>[\s\S]*?name:`id`,type:`Identifier`\}\]\}\)/, 'Ma=()=>({from:{alias:`Jz7TssHlT`,data:[],type:`Collection`},limit:{type:`LiteralValue`,value:0},offset:{type:`LiteralValue`,value:0},select:[]})');
bg = bg.replace(/Na=\(\)=>[\s\S]*?name:`id`,type:`Identifier`\}\]\}\)/, 'Na=()=>({from:{alias:`INIECR1yQ`,data:[],type:`Collection`},limit:{type:`LiteralValue`,value:0},offset:{type:`LiteralValue`,value:0},select:[]})');
bg = bg.replace(/Pa=\(\)=>[\s\S]*?name:`id`,type:`Identifier`\}\]\}\)/, 'Pa=()=>({from:{alias:`fnMTRDHB6`,data:[],type:`Collection`},limit:{type:`LiteralValue`,value:0},offset:{type:`LiteralValue`,value:0},select:[]})');

fs.writeFileSync(bgPath, bg, 'utf8');
console.log('BgXe2d9Y.mjs written.');

// --- 2. Modify augiA20Il.js ---
const augiPath = 'framerusercontent.com/sites/1UfZHGPLfx7SHOUvvJ36FC/https/framerusercontent.com/modules/8gCbIUtp9q3ZhWO40c2a/32nlpfDTTVumJWrrBovd/augiA20Il.js';
let augi = fs.readFileSync(augiPath, 'utf8');

const augiTarget1 = 'className: "framer-rjguy"';
const augiCutStart = augi.lastIndexOf('/*#__PURE__*/ _jsx(motion.div, {', augi.indexOf(augiTarget1));

const augiTarget3 = 'className: "framer-1ixs3tg"';
const augiIdx3 = augi.indexOf(augiTarget3);
const searchPattern = `                                    }\r\n                                  ),\r\n                                }),`;
const searchPatternLF = `                                    }\n                                  ),\n                                }),`;

let augiEnd3 = augi.indexOf(searchPattern, augiIdx3);
let augiMatchLen = searchPattern.length;
if (augiEnd3 === -1) {
  augiEnd3 = augi.indexOf(searchPatternLF, augiIdx3);
  augiMatchLen = searchPatternLF.length;
}

if (augiCutStart !== -1 && augiEnd3 !== -1) {
  augi = augi.slice(0, augiCutStart) + augi.slice(augiEnd3 + augiMatchLen);
  console.log('augiA20Il.js: cut JSX successfully');
}
fs.writeFileSync(augiPath, augi, 'utf8');
console.log('augiA20Il.js written.');
