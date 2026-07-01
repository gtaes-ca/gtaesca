import crypto from 'crypto';

export function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

export function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}
