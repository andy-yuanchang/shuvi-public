import { fileUtils } from '@shuvi/service/esm/project';
import { defineFile } from '../../../index.js';
import { ProjectContext } from '../../../../projectContext.js';

const { getAllFiles, getFirstModuleExport } = fileUtils;

export default (context: ProjectContext) => {
  const { error } = context.userModule;
  const candidates = Array.isArray(error) ? error : [error];
  return defineFile({
    dependencies: candidates,
    content: () => {
      return getFirstModuleExport(getAllFiles(candidates), candidates, true);
    }
  });
};
