const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // 0/1/o/l kabi chalkash belgilar olib tashlandi

export function generateSlug(length = 7): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}
