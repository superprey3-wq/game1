#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { SKINS } from '../shared/skins.js';

const BASE = 'https://cs2.duskrain.cn/';
const MANIFEST = 'assets/asset-manifest-mobile.json';
const CONCURRENCY = Math.max(1, Math.min(12, Number(process.env.ASSET_FETCH_CONCURRENCY || 8)));

async function fetchFile(relative, expectedBytes, expectedHash) {
  const target = path.join('public', relative);
  await mkdir(path.dirname(target), { recursive: true });
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await fetch(new URL(relative, BASE), { signal: AbortSignal.timeout(300000) });
      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
  if (Number.isFinite(expectedBytes) && bytes.length !== expectedBytes) {
    throw new Error(`Size mismatch for ${relative}: expected ${expectedBytes}, got ${bytes.length}`);
  }
  const entry = manifest?.files?.find?.(file => file.path === relative);
  const wantedHash = expectedHash || entry?.sha256;
  if (wantedHash) {
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== wantedHash) throw new Error(`SHA-256 mismatch for ${relative}`);
  }
      await writeFile(target, bytes);
      return bytes.length;
    } catch (error) {
      lastError = error;
      console.warn(`Retry ${attempt}/4 for ${relative}: ${error?.message || error}`);
      if (attempt < 4) await new Promise(resolve => setTimeout(resolve, attempt * 2000));
    }
  }
  throw new Error(`Failed to fetch ${relative} after 4 attempts: ${lastError?.message || lastError}`);
}

async function ensureManifest() {
  const target = path.join('public', MANIFEST);
  try { return JSON.parse(await readFile(target, 'utf8')); }
  catch {
    await fetchFile(MANIFEST);
    return JSON.parse(await readFile(target, 'utf8'));
  }
}

let manifest;
manifest = await ensureManifest();
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
    const size = await fetchFile(file.path, file.bytes);
    bytes += size;
    done++;
    if (done % 50 === 0 || done === total) {
      console.log(`${done}/${total} files · ${(bytes/1048576).toFixed(1)} MiB`);
    }
  }
});
await Promise.all(workers);
console.log('Mobile asset pack is stored locally on the Render service.');

const STARTUP_WEAPONS = new Set(['m4a1','ak47','usp','pistol','knife']);
const extras = [];
for (const skin of SKINS.filter(skin => skin.isDefault && STARTUP_WEAPONS.has(skin.weapon))) {
  extras.push({ path: skin.model, bytes: skin.bytes, sha256: skin.sha256 });
  if (skin.animation) extras.push({ path: skin.animation.model, bytes: skin.animation.bytes, sha256: skin.animation.sha256 });
}
const uniqueExtras = [...new Map(extras.map(item => [item.path, item])).values()]
  .filter(item => !manifest.files.some(file => file.path === item.path));
let extraBytes = 0;
console.log(`Fetching ${uniqueExtras.length} startup/gameplay models in addition to the mobile manifest`);
for (let i = 0; i < uniqueExtras.length; i += CONCURRENCY) {
  const batch = uniqueExtras.slice(i, i + CONCURRENCY);
  const sizes = await Promise.all(batch.map(item => fetchFile(item.path, item.bytes, item.sha256)));
  extraBytes += sizes.reduce((n, value) => n + value, 0);
  console.log(`extra ${Math.min(i + batch.length, uniqueExtras.length)}/${uniqueExtras.length} · ${(extraBytes/1048576).toFixed(1)} MiB`);
}
console.log(`Render local asset set ready: ${(totalBytes/1048576).toFixed(1)} MiB base + ${(extraBytes/1048576).toFixed(1)} MiB gameplay models`);
