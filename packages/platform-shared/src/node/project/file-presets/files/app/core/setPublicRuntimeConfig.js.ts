import { defineFile } from '../../../index.js';
import { resolvePkgFile } from '../../../../../paths.js';

export default () =>
  defineFile({
    content: () =>
      `export { setPublicRuntimeConfig as default } from '${resolvePkgFile(
        'esm/shared/shuvi-singleton-runtimeConfig'
      )}'`
  });
