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
