import { IRuntime } from '@shuvi/service';
import { config as configBundler } from './bundler/config';
import { resolveAppFile, resolveDep, resolveLib } from '../../paths';

const webReactRuntime: IRuntime = {
  async install(api): Promise<void> {
    api.setPlatformModule(resolveAppFile('react/index'));
    // IE11 polyfill: https://github.com/facebook/create-react-app/blob/c38aecf73f8581db4a61288268be3a56b12e8af6/packages/react-app-polyfill/README.md#polyfilling-other-language-features
    api.addAppPolyfill(resolveDep('react-app-polyfill/ie11'));
    api.addAppPolyfill(resolveDep('react-app-polyfill/stable'));
    api.addAppExport(resolveAppFile('react/App'), '{ default as App }');
    api.addAppExport(resolveAppFile('react/head/head'), '{default as Head}');
    api.addAppExport(resolveAppFile('react/dynamic'), '{default as dynamic}');
    api.addAppExport(
      resolveLib('@shuvi/router-react'),
      '{ useParams, useRouter, useCurrentRoute, Link, RouterView, withRouter }'
    );
    configBundler(api);
  }
};

export default webReactRuntime;