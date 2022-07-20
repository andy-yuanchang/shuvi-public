import {
  createAsyncParallelHook,
  createAsyncSeriesWaterfallHook
} from '@shuvi/hook';
import { IRuntimeConfig } from '../../../../shared/index.js';

const addEntryCode = createAsyncParallelHook<void, void, string | string[]>();
const addPolyfill = createAsyncParallelHook<void, void, string | string[]>();
const modifyRuntimeConfig = createAsyncSeriesWaterfallHook<
  {
    public: IRuntimeConfig;
    server: IRuntimeConfig;
  },
  void
>();

export const extendedHooks = {
  addEntryCode,
  addPolyfill,
  modifyRuntimeConfig
};
