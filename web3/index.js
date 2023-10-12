import { Keypair } from "@solana/web3.js";

const SECRET_KEY = Uint8Array.from([
  1, 184, 246, 195, 113, 111, 219, 234, 194, 41, 153, 87, 84, 53, 222, 85, 68,
  193, 124, 85, 70, 230, 124, 232, 64, 216, 164, 216, 58, 219, 93, 42, 229, 25,
  6, 102, 145, 5, 177, 102, 229, 100, 222, 10, 124, 133, 176, 220, 65, 22, 233,
  20, 50, 75, 177, 175, 200, 108, 35, 5, 9, 219, 9, 126,
]);

const keypair = Keypair.fromSecretKey(Uint8Array.from(SECRET_KEY));

console.log({
  publicKeyStr: keypair.publicKey.toString(),
  publicKeyJSON: keypair.publicKey.toJSON(),
  publicKeyBase58: keypair.publicKey.toBase58(),
  secretKey: keypair.secretKey,
});
