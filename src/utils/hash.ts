import { createHash } from 'crypto';

export function hashedHex(input: string) {
  return createHash('sha256').update(input).digest('hex');
}
