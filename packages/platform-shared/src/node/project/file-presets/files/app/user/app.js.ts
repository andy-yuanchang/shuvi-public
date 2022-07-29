import { fileUtils } from '@shuvi/service/project';
import { defineFile } from '../../../index.js';
import { ProjectContext } from '../../../../projectContext.js';

const { getAllFiles, getFirstModuleExport } = fileUtils;

export default (context: ProjectContext) => {
  const { app } = context.userModule;
  const candidates = Array.isArray(app) ? app : [app];
  return defineFile({
    dependencies: candidates,
    content: () => {
      return getFirstModuleExport(getAllFiles(candidates), candidates);
    }
  });
};
