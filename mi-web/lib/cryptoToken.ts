import crypto from 'crypto';

function getSecretKey() {
  const secret = process.env.DRIVE_TOKEN_SECRET || 'electrocaribe-default-secret-key-32b!';
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptId(plainId: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getSecretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainId, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

export function decryptId(tokenHex: string): string | null {
  try {
    const data = Buffer.from(tokenHex, 'hex');
    if (data.length < 29) return null;

    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const decipher = crypto.createDecipheriv('aes-256-gcm', getSecretKey(), iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return null;
  }
}
