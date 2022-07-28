import * as customApp from '@shuvi/app/user/app';
import { pluginRecord } from '@shuvi/app/core/plugins';
import { Application } from '../shared/application.js';
import {
  createRuntimePlugin,
  IAppModule,
  IApplicationOptions
} from './shared.js';
import {
  IRuntimePluginConstructor,
  IPluginRecord,
  IPluginList
} from '../shared/lifecycle.js';

export { Application };

function getPlugins(runtime: IAppModule, pluginRecords: IPluginRecord) {
  const plugins: IPluginList = [];

  const keys = Object.keys(pluginRecords);
  for (let index = 0; index < keys.length; index++) {
    const name = keys[index];
    const plugin = pluginRecords[name];
    plugins.push([plugin.plugin, plugin.options]);
  }

  const pluginConstructor: IRuntimePluginConstructor = {};
  const methods: Array<keyof typeof runtime> = [
    'appComponent',
    'appContext',
    'init',
    'dispose'
  ];

  for (let index = 0; index < methods.length; index++) {
    const method = methods[index];
    if (typeof runtime[method] === 'function') {
      //@ts-ignore
      pluginConstructor[method] = runtime[method];
    }
  }

  plugins.push([createRuntimePlugin(pluginConstructor)]);
  return plugins;
}

export default function application(options: IApplicationOptions): Application {
  const application = new Application({
    ...options,
    plugins: getPlugins(customApp, pluginRecord)
  });

  return application;
}
