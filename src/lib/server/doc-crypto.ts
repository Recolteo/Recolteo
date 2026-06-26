import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const hex = process.env.DOCUMENT_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) throw new Error("DOCUMENT_ENCRYPTION_KEY manquante ou invalide (64 hex chars requis)");
  return Buffer.from(hex, "hex");
}

export function encryptBuffer(plain: Buffer): Buffer {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]);
}

export function decryptBuffer(blob: Buffer): Buffer {
  const key = getKey();
  const iv = blob.subarray(0, 12);
  const authTag = blob.subarray(12, 28);
  const ciphertext = blob.subarray(28);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
