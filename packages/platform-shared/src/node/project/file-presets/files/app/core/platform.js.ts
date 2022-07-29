import { defineFile } from '../../../index.js';
import { fileUtils } from '@shuvi/service/project';
import { ProjectContext } from '../../../../projectContext.js';

export default (context: ProjectContext) =>
  defineFile({
    content: async () => {
      return fileUtils.getModuleExport(context.platformModule);
    }
  });
