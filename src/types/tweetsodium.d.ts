declare module "tweetsodium" {
  export function seal(message: Buffer, publicKey: Buffer): Uint8Array;
}
