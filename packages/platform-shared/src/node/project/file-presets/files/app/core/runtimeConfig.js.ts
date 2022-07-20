import { defineFile } from '../../../index.js';
import { getPublicRuntimeConfig } from '../../../../../../shared/shuvi-singleton-runtimeConfig.js';
import { ProjectContext } from '../../../../projectContext.js';

export default (context: ProjectContext) =>
  defineFile({
    content: () => {
      const runtimeConfigContent = getPublicRuntimeConfig()
        ? JSON.stringify(getPublicRuntimeConfig())
        : null;
      return `export default ${runtimeConfigContent}`;
    }
  });
