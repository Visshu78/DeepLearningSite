import fs from 'node:fs';
import path from 'node:path';

const projectsFile = path.resolve('lib/lesson-data/projects.ts');
const content = fs.readFileSync(projectsFile, 'utf8');

const urlRegex = /(?:url|secondaryUrl):\s*'([^']+)'/g;
const urls = new Set();
let match;
while ((match = urlRegex.exec(content)) !== null) {
  urls.add(match[1]);
}

console.log(`Checking ${urls.size} unique dataset URLs from lib/lesson-data/projects.ts...\n`);

let okCount = 0;
let warnCount = 0;
let failCount = 0;

for (const url of urls) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NeuroPlayLinkChecker/1.0)',
      },
    });
    clearTimeout(timeout);

    if (res.status === 200) {
      okCount++;
      console.log(`[200 OK]   ${url}`);
    } else if (res.status === 403 || res.status === 429) {
      warnCount++;
      console.log(`[${res.status} BOT]  ${url}`);
    } else {
      failCount++;
      console.log(`[${res.status} ERR]  ${url}`);
    }
  } catch (err) {
    failCount++;
    console.log(`[FAILED]   ${url} (${err.message})`);
  }
}

console.log(`\nSummary: ${okCount} HTTP 200, ${warnCount} bot-guarded (403/429), ${failCount} failed/other.`);
if (failCount > 0) {
  process.exitCode = 1;
}
