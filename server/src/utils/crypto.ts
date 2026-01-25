import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  // Hash the key to ensure it's exactly 32 bytes for AES-256
  return crypto.createHash('sha256').update(key).digest();
}

export function encrypt(text: string): string {
  if (!text) return text;

  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encryptedData (all hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;

  // Check if it looks like encrypted data (has the iv:authTag:data format)
  if (!encryptedText.includes(':')) {
    // Return as-is if not encrypted (for backwards compatibility)
    return encryptedText;
  }

  const key = getKey();
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

  if (!ivHex || !authTagHex || !encrypted) {
    // Malformed, return as-is
    return encryptedText;
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
