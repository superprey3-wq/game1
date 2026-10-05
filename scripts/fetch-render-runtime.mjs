#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://cs2.duskrain.cn/';
const files = [
  'assets/asset-manifest.json',
  'assets/asset-manifest-mobile.json',
  'assets/map/collision.json',
  'assets/map/penetration-materials.u8',
];

for (const relative of files) {
  const url = new URL(relative, BASE);
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${relative}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const target = path.join('public', relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  console.log(`Fetched ${relative} (${bytes.length} bytes)`);
}
