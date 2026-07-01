import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = process.env.UPLOADS_DIR || path.resolve(__dirname, '../../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

function ensureAvatarsDir() {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

function extensionForMime(mime) {
  const normalized = mime.toLowerCase();
  if (normalized === 'image/jpeg') return 'jpg';
  if (normalized === 'image/png') return 'png';
  if (normalized === 'image/webp') return 'webp';
  if (normalized === 'image/gif') return 'gif';
  return null;
}

export function getUploadsDir() {
  return uploadsDir;
}

export function saveProfileImage(userId, dataUrl) {
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
    throw new Error('Profile image must be 2MB or smaller.');
  }

  ensureAvatarsDir();

  for (const existingExt of ALLOWED_EXTENSIONS) {
    const existingPath = path.join(avatarsDir, `${userId}.${existingExt}`);
    if (fs.existsSync(existingPath)) {
      fs.unlinkSync(existingPath);
    }
  }

  const filename = `${userId}.${ext}`;
  fs.writeFileSync(path.join(avatarsDir, filename), buffer);

  return `/uploads/avatars/${filename}`;
}

export function deleteProfileImage(userId) {
  ensureAvatarsDir();

  for (const ext of ALLOWED_EXTENSIONS) {
    const filePath = path.join(avatarsDir, `${userId}.${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
