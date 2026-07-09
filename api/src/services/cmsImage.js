import fs from 'fs';
import path from 'path';
import { getUploadsDir } from './profileImage.js';

const cmsDir = path.join(getUploadsDir(), 'cms');
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

function ensureCmsDir() {
  fs.mkdirSync(cmsDir, { recursive: true });
}

function extensionForMime(mime) {
  const normalized = mime.toLowerCase();
  if (normalized === 'image/jpeg') return 'jpg';
  if (normalized === 'image/png') return 'png';
  if (normalized === 'image/webp') return 'webp';
  if (normalized === 'image/gif') return 'gif';
  return null;
}

export function saveCmsImage(filenameBase, dataUrl) {
  const match = String(dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid image format. Use JPEG, PNG, WebP, or GIF.');
  }

  const ext = extensionForMime(match[1]);
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error('Unsupported image type. Use JPEG, PNG, WebP, or GIF.');
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 5MB or smaller.');
  }

  ensureCmsDir();

  const safeBase = String(filenameBase).replace(/[^a-zA-Z0-9-_]/g, '-');
  for (const existingExt of ALLOWED_EXTENSIONS) {
    const existingPath = path.join(cmsDir, `${safeBase}.${existingExt}`);
    if (fs.existsSync(existingPath)) {
      fs.unlinkSync(existingPath);
    }
  }

  const filename = `${safeBase}.${ext}`;
  fs.writeFileSync(path.join(cmsDir, filename), buffer);

  return `/uploads/cms/${filename}`;
}
