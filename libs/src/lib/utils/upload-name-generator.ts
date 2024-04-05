import { randomHex } from './random-hex';

export function uploadFileNameGenerator(fileName: string) {
  return Date.now() + '-' + randomHex(20) + '-' + fileName;
}
