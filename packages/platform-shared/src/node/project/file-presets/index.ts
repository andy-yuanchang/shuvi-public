import * as fs from 'fs';
import * as path from 'path';
import {
  defineFile as originalDefineFile,
  FileOptions,
  DefineFileOption
} from '@shuvi/service/project';
import { ProjectContext } from '../projectContext.js';
import { dirname } from '../../paths.js';

const EXT_REGEXP = /\.[a-zA-Z]+$/;

/**
 * All preset files are listed in `files` folder as real files arrange.
 * These presets export objects as FileOptions with which fileManager will generate files.
 */
const getAllFiles = async (
  context: ProjectContext,
  dirPath: string,
  parent: string = '',
  fileList: FileOptions[] = []
): Promise<FileOptions[]> => {
  const files = fs.readdirSync(dirPath);
  let currentFileList: FileOptions[] = fileList;
  for (let file of files) {
    const filepath = path.join(dirPath, file);
    const name = path.join(parent, file.replace(EXT_REGEXP, ''));
    if (fs.statSync(filepath).isDirectory()) {
      currentFileList = await getAllFiles(
        context,
        filepath,
        name,
        currentFileList
      );
      // Match *.ts (source) or *.js (compiled) file, but ignore *.d.ts file
    } else if (/\.(js|ts)$/.test(file) && !/\.d\.ts$/.test(file)) {
      const fileOptionsCreater = (await import(filepath)).default;
      const options = fileOptionsCreater(context);
      currentFileList.push(
        originalDefineFile({
          ...options,
          name
        })
      );
    }
  }

  return currentFileList;
};

export async function getFilePresets(
  context: ProjectContext
): Promise<FileOptions[]> {
  return await getAllFiles(
    context,
    path.join(dirname(import.meta.url), 'files')
  );
}

export const defineFile = (options: Omit<DefineFileOption, 'name'>) => options;
