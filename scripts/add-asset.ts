/**
 * add-asset: upload a file to Vercel Blob, generate a typed key,
 * and patch lib/assets.ts with the new entry.
 *
 * Usage: pnpm add-asset <file-path> [--key <name>] [--type image|video]
 *                                   [--force] [--dry-run]
 */

import { readFileSync, existsSync } from 'fs';
import { extname, basename } from 'path';

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
