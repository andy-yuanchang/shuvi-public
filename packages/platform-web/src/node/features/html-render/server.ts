import { createServerPlugin } from '@shuvi/service';
import { extendedHooks } from './serverHooks.js';

export default createServerPlugin({
  setup: ({ addHooks }) => {
    addHooks(extendedHooks);
  }
});
