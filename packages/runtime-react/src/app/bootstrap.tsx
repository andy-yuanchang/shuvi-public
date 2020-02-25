/// <reference path="../../client-env.d.ts" />

import React from "react";
import ReactDom from "react-dom";
import { Router } from "@shuvi/runtime-react/dep/react-router-dom";
import { Runtime } from "@shuvi/core/types";
import Loadable from "@shuvi/runtime-react/lib/runtime/loadable";
import { createBrowserHistory } from "@shuvi/runtime-react/lib/runtime/router/history";
// @ts-ignore
import { setHistory } from "@shuvi/runtime-react/lib/runtime/router/router";
import { App } from "./app";

export const bootstrap: Runtime.Bootstrap = async ({
  appData,
  appContainer
}) => {
  await Loadable.preloadReady(appData.dynamicIds);

  // TODO: hash history(tree shaking)
  // TODO: config basename
  const history = createBrowserHistory({ basename: "/" });
  setHistory(history);

  return ReactDom.render(
    <Router history={history}>
      <App routeProps={appData.routeProps} />
    </Router>,
    appContainer
  );
};
