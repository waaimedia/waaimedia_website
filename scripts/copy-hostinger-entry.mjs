import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = new URL('./hostinger-output-entry.js', import.meta.url);
const destination = new URL('../dist/media-news-company/server.js', import.meta.url);

await copyFile(fileURLToPath(source), fileURLToPath(destination));
