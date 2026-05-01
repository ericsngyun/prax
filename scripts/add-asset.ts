/**
 * add-asset: upload a file to Vercel Blob, generate a typed key,
 * and patch lib/assets.ts with the new entry.
 *
 * Usage: pnpm add-asset <file-path> [--key <name>] [--type image|video]
 *                                   [--force] [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { extname, basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';
import { execSync } from 'child_process';
import { put } from '@vercel/blob';

export type MediaType = 'image' | 'video';

export interface ParsedArgs {
  filePath: string;
  key?: string;
  type?: MediaType;
  force: boolean;
  dryRun: boolean;
}

export const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic', '.heif',
]);

export const VIDEO_EXTENSIONS = new Set([
  '.mp4', '.mov', '.webm', '.m4v',
]);

/**
 * Convert a filename or path into a camelCase asset key.
 * Strips directory and extension. Splits on non-alphanumeric.
 * Lowercases the first segment, capitalizes subsequent segments.
 * Prefixes with "asset" if the result would start with a digit.
 *
 * Throws if the result is empty.
 */
export function toCamelCaseKey(filenameOrPath: string): string {
  const filename = basename(filenameOrPath);
  if (/^\.[a-zA-Z0-9]+$/.test(filename)) {
    throw new Error(`Cannot derive key from "${filenameOrPath}" — filename is just an extension`);
  }

  const stem = basename(filenameOrPath, extname(filenameOrPath));
  const parts = stem.split(/[^a-zA-Z0-9]+/).filter(Boolean);

  if (parts.length === 0) {
    throw new Error(`Cannot derive key from "${filenameOrPath}" — no alphanumerics`);
  }

  const camel = parts
    .map((p, i) => (i === 0 ? p.toLowerCase() : p[0].toUpperCase() + p.slice(1).toLowerCase()))
    .join('');

  return /^[0-9]/.test(camel) ? `asset${camel[0].toUpperCase()}${camel.slice(1)}` : camel;
}

/**
 * Detect "image" or "video" from file extension.
 * Throws if the extension isn't in either whitelist.
 */
export function detectMediaType(filenameOrPath: string): MediaType {
  const ext = extname(filenameOrPath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  throw new Error(
    `Cannot detect media type for "${filenameOrPath}" (extension "${ext}"). ` +
    `Supported images: ${[...IMAGE_EXTENSIONS].join(', ')}. ` +
    `Supported videos: ${[...VIDEO_EXTENSIONS].join(', ')}.`
  );
}

/**
 * Parse an array of CLI arguments (positional + flags).
 * Throws on missing required positional or invalid --type value.
 */
export function parseAddAssetArgs(argv: string[]): ParsedArgs {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      key: { type: 'string' },
      type: { type: 'string' },
      force: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
    },
  });

  if (positionals.length === 0) {
    throw new Error('Missing required argument: <file-path>');
  }

  const type = values.type;
  if (type !== undefined && type !== 'image' && type !== 'video') {
    throw new Error(`--type must be "image" or "video", got "${type}"`);
  }

  return {
    filePath: positionals[0],
    key: values.key,
    type: type as MediaType | undefined,
    force: values.force ?? false,
    dryRun: values['dry-run'] ?? false,
  };
}

/** Match an entry like `  someKey: 'https://...',` returning the key name. */
const ENTRY_REGEX = /^\s+([a-zA-Z][a-zA-Z0-9]*)\s*:\s*['"]/gm;

const MANUAL_SECTION_HEADER = '  // Manually added (via add-asset)';

/**
 * Extract every top-level key name from the `assets` object literal in the file content.
 * Order matches source order.
 */
export function listExistingKeys(fileContent: string): string[] {
  const keys: string[] = [];
  for (const match of fileContent.matchAll(ENTRY_REGEX)) {
    keys.push(match[1]);
  }
  return keys;
}

/**
 * Insert a new {key: url} entry into the `assets` object literal in fileContent.
 * Uses an "// Manually added (via add-asset)" subsection placed just before
 * the closing `} as const;`. Creates the subsection if absent.
 *
 * Options.force=true allows overwriting an existing key (replaces its value
 * in-place, regardless of which section the key lives in).
 *
 * Returns the new file content. Throws if the key exists and force is false.
 */
export function patchAssetsFile(
  fileContent: string,
  key: string,
  url: string,
  options: { force?: boolean } = {}
): string {
  const force = options.force ?? false;
  const existingKeys = listExistingKeys(fileContent);

  if (existingKeys.includes(key)) {
    if (!force) {
      throw new Error(
        `Asset key "${key}" already exists in lib/assets.ts. ` +
        `Use --force to overwrite, or pick a different --key.`
      );
    }
    // Replace the existing entry's URL in place
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const replaceRegex = new RegExp(`(${escapedKey}\\s*:\\s*)['"][^'"]*['"]`);
    return fileContent.replace(replaceRegex, `$1'${url}'`);
  }

  const newEntry = `  ${key}: '${url}',`;

  if (fileContent.includes(MANUAL_SECTION_HEADER)) {
    // Append before the closing brace (lands at the end of the manual section)
    return fileContent.replace(
      /\n\} as const;/,
      `\n${newEntry}\n} as const;`
    );
  }

  // Create the manual section just before the closing brace
  return fileContent.replace(
    /\n\} as const;/,
    `\n\n${MANUAL_SECTION_HEADER}\n${newEntry}\n} as const;`
  );
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_FILE = join(__dirname, '..', 'lib', 'assets.ts');

/**
 * Upload a file to Vercel Blob with a stable filename prax/<key>.<ext>.
 * Stable filename + addRandomSuffix:false means re-uploads with --force
 * overwrite cleanly.
 */
async function uploadToBlob(
  filePath: string,
  key: string,
  type: MediaType
): Promise<string> {
  const bytes = readFileSync(filePath);
  const ext = extname(filePath).toLowerCase();
  const blobPath = `prax/${key}${ext}`;
  const contentType =
    type === 'video'
      ? `video/${ext.slice(1)}`
      : `image/${ext === '.jpg' ? 'jpeg' : ext.slice(1)}`;

  const { url } = await put(blobPath, bytes, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
  });

  return url;
}

async function main(): Promise<void> {
  const args = parseAddAssetArgs(process.argv.slice(2));

  if (!existsSync(args.filePath)) {
    console.error(`File not found: ${args.filePath}`);
    process.exit(1);
  }

  const type = args.type ?? detectMediaType(args.filePath);
  const key = args.key ?? toCamelCaseKey(args.filePath);

  const currentAssets = readFileSync(ASSETS_FILE, 'utf-8');
  const keyExists = listExistingKeys(currentAssets).includes(key);

  if (keyExists && !args.force) {
    console.error(
      `Asset key "${key}" already exists in lib/assets.ts. ` +
      `Use --force to overwrite, or pass --key <name> to choose a different key.`
    );
    process.exit(1);
  }

  console.log(`File:    ${args.filePath}`);
  console.log(`Type:    ${type}`);
  console.log(`Key:     ${key}${keyExists ? ' (will overwrite)' : ''}`);

  if (args.dryRun) {
    console.log('\n[--dry-run] No upload performed, lib/assets.ts not modified.');
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is required for upload. Set it in .env.local.');
    process.exit(1);
  }

  console.log('\nUploading to Vercel Blob...');
  const url = await uploadToBlob(args.filePath, key, type);
  console.log(`Uploaded: ${url}`);

  const patched = patchAssetsFile(currentAssets, key, url, { force: args.force });
  writeFileSync(ASSETS_FILE, patched, 'utf-8');
  console.log(`Patched: ${ASSETS_FILE}`);

  try {
    const diff = execSync(`git diff --color ${ASSETS_FILE}`, { encoding: 'utf-8' });
    if (diff) {
      console.log('\nDiff:');
      console.log(diff);
    }
  } catch {
    // git may not be available or file may be outside a repo — non-fatal
  }

  console.log('\nDone. Review the diff above, then `git add` and commit when satisfied.');
}

// Run main() only when this file is executed directly (not when imported by tests)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
