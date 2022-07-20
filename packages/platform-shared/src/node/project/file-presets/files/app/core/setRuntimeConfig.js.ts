import { defineFile } from '../../../index.js';
import { resolvePkgFile } from '../../../../../paths.js';

export default () =>
  defineFile({
    content: () =>
      `export { setRuntimeConfig as default } from '${resolvePkgFile(
        'lib/shared/shuvi-singleton-runtimeConfig'
      )}'`
  });
