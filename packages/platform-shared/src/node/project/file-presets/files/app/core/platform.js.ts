import { defineFile } from '../../../index.js';
import { fileUtils } from '@shuvi/service/esm/project';
import { ProjectContext } from '../../../../projectContext.js';

export default (context: ProjectContext) =>
  defineFile({
    content: () => {
      return fileUtils.getModuleExport(context.platformModule);
    }
  });
