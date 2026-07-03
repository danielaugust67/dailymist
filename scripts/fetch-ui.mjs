import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const urls = {
  login: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWFkMTc4NmIyZDIwOTI1Yzc5ODMwMWNlYWVlEgsSBxCAvMKDoxAYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjEyMjk3NDM3MDI4NDM4NzQ3Mw&filename=&opi=89354086',
  register: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWFkMTc5OWJmYzEwOTI1YzdkNTcyMjIzNDMyEgsSBxCAvMKDoxAYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjEyMjk3NDM3MDI4NDM4NzQ3Mw&filename=&opi=89354086',
  homepage: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWFkMTZhMDQyM2UwMzMyZjhkZjcwMTBkMDk1EgsSBxCAvMKDoxAYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjEyMjk3NDM3MDI4NDM4NzQ3Mw&filename=&opi=89354086',
  listing: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWFkMTdhZGQ0ZmUwN2M0ZDQ1NDRhMGRjODc2EgsSBxCAvMKDoxAYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjEyMjk3NDM3MDI4NDM4NzQ3Mw&filename=&opi=89354086',
  detail: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWFkMTZiYWYzMTMwMzM4NTgzN2VmMDczMTU4EgsSBxCAvMKDoxAYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjEyMjk3NDM3MDI4NDM4NzQ3Mw&filename=&opi=89354086'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('⏳ Downloading Phase 1 & 2 HTML from Stitch...');
  await download(urls.login, path.join(__dirname, '../login.html'));
  await download(urls.register, path.join(__dirname, '../register.html'));
  await download(urls.homepage, path.join(__dirname, '../stitch-homepage.html'));
  await download(urls.listing, path.join(__dirname, '../stitch-listing.html'));
  await download(urls.detail, path.join(__dirname, '../stitch-detail.html'));
  console.log('✅ HTML downloaded successfully');
}

main().catch(console.error);
