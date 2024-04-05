import { join, resolve } from 'path';

export function getRootPath(path: string): string {
  const rootDir = resolve(__dirname, '../../../../');
  return join(rootDir, path);
}
