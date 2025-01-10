import { seal } from "tweetsodium";

export const encryptSecret = (secret: string, publicKey: string): string => {
  const messageBytes = Buffer.from(secret);
  const keyBytes = Buffer.from(publicKey, "base64");
  const encryptedBytes = seal(messageBytes, keyBytes);
  return Buffer.from(encryptedBytes).toString("base64");
};
