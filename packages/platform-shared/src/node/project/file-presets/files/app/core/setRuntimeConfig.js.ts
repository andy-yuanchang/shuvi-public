import { defineFile } from '../../../index.js';
import { resolvePkgFile } from '../../../../../paths.js';

export default () =>
  defineFile({
    content: () =>
      `export { setRuntimeConfig as default } from '${resolvePkgFile(
        'esm/shared/shuvi-singleton-runtimeConfig'
      )}'`
  });
