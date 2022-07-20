import { defineFile } from '../../../index.js';
import { ProjectContext } from '../../../../projectContext.js';

export default (context: ProjectContext) =>
  defineFile({
    content: () => context.polyfills.map(file => `import "${file}"`).join('\n')
  });
