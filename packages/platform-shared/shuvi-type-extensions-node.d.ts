import { IRuntimeConfig } from './src/shared/index.js';
import { extendedHooks } from './src/node/platform/plugins/main/hooks.js';

export {};

declare global {
  namespace ShuviService {
    interface CustomConfig {
      publicRuntimeConfig?: IRuntimeConfig;
      runtimeConfig?: IRuntimeConfig;
    }

    interface CustomCorePluginHooks {
      addEntryCode: typeof extendedHooks.addEntryCode;
      addPolyfill: typeof extendedHooks.addPolyfill;
      modifyRuntimeConfig: typeof extendedHooks.modifyRuntimeConfig;
    }
  }
}
