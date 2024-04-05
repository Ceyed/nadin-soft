import * as crypto from 'crypto';

export function randomHex(size: number): string {
  return crypto.randomBytes(size).toString('hex');
}
