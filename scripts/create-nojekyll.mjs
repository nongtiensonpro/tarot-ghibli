import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const filePath = resolve(distDir, '.nojekyll');

await mkdir(distDir, { recursive: true });
await writeFile(filePath, '', 'utf8');
