import { IRouter } from '@shuvi/router';
import { IRouteComponent } from '@shuvi/platform-shared/esm/runtime';
import * as React from 'react';
import { useRouter } from './hooks';

export type WithRouterProps = {
  router: IRouter;
};

export type ExcludeRouterProps<P> = Pick<
  P,
  Exclude<keyof P, keyof WithRouterProps>
>;
/**
 * withRouter is HOC, add property router to param `ComposedComponent`
 * @param ComposedComponent IRouteComponent
 * @returns `<ComposedComponent router={useRouter()} {...props} />`
 */
export function withRouter<P extends WithRouterProps>(
  ComposedComponent: IRouteComponent<React.ComponentType<P>, any>
): IRouteComponent<React.ComponentType<ExcludeRouterProps<P>>, any> {
  function WithRouterWrapper(props: any) {
    return <ComposedComponent router={useRouter()} {...props} />;
  }

  WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;

  if (process.env.NODE_ENV !== 'production') {
    const name =
      ComposedComponent.displayName || ComposedComponent.name || 'Unknown';
    WithRouterWrapper.displayName = `withRouter(${name})`;
  }

  return WithRouterWrapper;
}
