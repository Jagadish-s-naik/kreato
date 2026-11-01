import crypto from "crypto";

export function getEncryptionKey(): Buffer {
  const keyBase64 = process.env.TOKEN_ENCRYPTION_KEY;
  if (!keyBase64) {
    throw new Error("TOKEN_ENCRYPTION_KEY is not configured on the server.");
  }
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be a 32-byte base64-encoded string.");
  }
  return key;
}

/**
 * Encrypts sensitive tokens using AES-256-GCM with a random 12-byte IV and 16-byte auth tag.
 * Output format: "ivHex:tagHex:cipherHex"
 */
export function encryptToken(text: string, customKey?: Buffer): string {
  const key = customKey || getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts AES-256-GCM encrypted tokens and verifies the authentication tag.
 * Throws an error if tampered or corrupt.
 */
export function decryptToken(encryptedString: string, customKey?: Buffer): string {
  const key = customKey || getEncryptionKey();
  const parts = encryptedString.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token payload format.");
  }
  const [ivHex, tagHex, cipherHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(cipherHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}

/**
 * Splits AES-256-GCM components into separate fields for relational DB storage.
 */
export function encryptForDb(text: string): { cipherText: string; iv: string; authTag: string } {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    cipherText: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: tag.toString("hex"),
  };
}

/**
 * Decrypts tokens stored across separate cipher, iv, and auth_tag columns.
 */
export function decryptFromDb(cipherText: string, ivHex: string, authTagHex: string): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(cipherText, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
