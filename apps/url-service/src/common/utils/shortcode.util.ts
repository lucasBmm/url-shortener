import { customAlphabet } from 'nanoid';

const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateBase62Code = customAlphabet(ALPHABET, 6);

export function generateShortCode(): string {
  return generateBase62Code();
}
