const ALPHABET = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const BASE = ALPHABET.length;

export function encode(num: number): string {
  if (num === 0) return ALPHABET[0];

  let encoded = '';
  let n = num;

  while (n > 0) {
    const remainder = n % BASE;
    n = Math.floor(n / BASE);
    encoded = ALPHABET[remainder] + encoded;
  }

  return encoded;
}

export function decode(str: string): number {
  let decoded = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = ALPHABET.indexOf(char);

    if (index === -1) {
      throw new Error(`Invalid character '${char}' in base58 string`);
    }

    const power = str.length - 1 - i;
    decoded += index * Math.pow(BASE, power);
  }

  return decoded;
}

/**
 * Generate a random base58 string of the specified length.
 * Uses crypto.getRandomValues for cryptographically secure randomness.
 *
 * With 8 characters: 58^8 = ~128 trillion possible codes
 */
export function generateRandomCode(length: number = 8): string {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[randomBytes[i] % ALPHABET.length];
  }

  return result;
}
