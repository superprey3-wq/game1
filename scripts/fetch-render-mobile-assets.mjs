#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://cs2.duskrain.cn/';
const MANIFEST = 'assets/asset-manifest-mobile.json';
const CONCURRENCY = Math.max(1, Math.min(12, Number(process.env.ASSET_FETCH_CONCURRENCY || 8)));

async function fetchFile(relative, expectedBytes) {
  const target = path.join('public', relative);
  await mkdir(path.dirname(target), { recursive: true });
  const response = await fetch(new URL(relative, BASE), { signal: AbortSignal.timeout(120000) });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status} fetching ${relative}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (Number.isFinite(expectedBytes) && bytes.length !== expectedBytes) {
    throw new Error(`Size mismatch for ${relative}: expected ${expectedBytes}, got ${bytes.length}`);
  }
  await writeFile(target, bytes);
  return bytes.length;
}

async function ensureManifest() {
  const target = path.join('public', MANIFEST);
  try { return JSON.parse(await readFile(target, 'utf8')); }
  catch {
    await fetchFile(MANIFEST);
    return JSON.parse(await readFile(target, 'utf8'));
  }
}

const manifest = await ensureManifest();
if (!Array.isArray(manifest.files) || !manifest.files.length) throw new Error('Invalid mobile asset manifest');

let next = 0, done = 0, bytes = 0;
const total = manifest.files.length;
const totalBytes = manifest.files.reduce((n, f) => n + (Number(f.bytes) || 0), 0);
console.log(`Fetching ${total} mobile assets (${(totalBytes/1048576).toFixed(1)} MiB) with ${CONCURRENCY} workers`);

const workers = Array.from({length: Math.min(CONCURRENCY,total)}, async () => {
  while (true) {
    const index = next++;
    if (index >= total) return;
    const file = manifest.files[index];
    bytes += await fetchFile(file.path, file.bytes);
    done++;
    if (done % 50 === 0 || done === total) {
      console.log(`${done}/${total} files · ${(bytes/1048576).toFixed(1)} MiB`);
    }
  }
});
await Promise.all(workers);
console.log('Mobile asset pack is stored locally on the Render service.');
