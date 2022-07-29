import * as fs from 'fs';
import { getExports } from '@shuvi/service/project/file-utils';
import { resolveFile } from '@shuvi/utils/lib/file.js';

export function ifComponentHasLoader(component: string) {
  const file = resolveFile(component);
  if (file) {
    const content = fs.readFileSync(file, 'utf-8');
    try {
      const exports = getExports(content);
      return exports.includes('loader');
    } catch {}
  }
  return false;
}
