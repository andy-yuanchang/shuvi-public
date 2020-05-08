/**
 * @jest-environment jsdom
 */

import { loadRouteComponent } from '../loadRouteComponent';
import { act } from 'shuvi-test-utils/reactTestRender';
import FirstPage from './fixtures/loadRouteComponent/firstPage';
import { renderWithRoutes } from './utils';
import { wait } from 'shuvi-test-utils';

const firstPageComponent = loadRouteComponent(() => {
  return import('./fixtures/loadRouteComponent/firstPage');
});

const secondPageComponent = loadRouteComponent(() => {
  return import('./fixtures/loadRouteComponent/secondPage');
});

describe('loadRouteComponent [web]', () => {
  const routes = [
    {
      id: 'secondPage',
      component: secondPageComponent,
      exact: true,
      path: '/second',
    },
    {
      id: 'firstPage',
      component: firstPageComponent,
      exact: true,
      path: '/first',
    },
  ];

  it('basic', async () => {
    const initialProps = {
      firstPage: {
        data: 'data from server',
      },
    };

    const { root, toJSON } = renderWithRoutes(
      {
        routes,
        initialProps,
      },
      { route: '/first' }
    );

    await act(async () => {
      await wait(1000);
    });

    // Spread initialProps as props
    expect(root.findByType(FirstPage).props).toMatchObject({
      data: 'data from server',
    });

    expect(toJSON()).toMatchInlineSnapshot(`
      <div>
        first page
      </div>
    `);
  });

  it('getInitialProps should work in client when the route component be activated', async () => {
    // No getInitialProps
    const { root, toJSON } = renderWithRoutes(
      { routes },
      {
        route: '/second',
      }
    );

    await act(async () => {});

    expect(toJSON()).toMatchInlineSnapshot(`
      <div>
        second page
        <a
          href="/first"
          onClick={[Function]}
        >
          go first page
        </a>
      </div>
    `);

    await act(async () => {
      root.findByType('a').props.onClick(new MouseEvent('click'));
    });

    // getInitialProps not resolved
    expect(toJSON()).toMatchInlineSnapshot(`null`);

    await act(async () => {
      await wait(1000);
    });

    // getInitialProps resolved
    expect(root.findByType(FirstPage).props).toMatchObject({
      data: 'done',
    });

    expect(toJSON()).toMatchInlineSnapshot(`
      <div>
        first page
      </div>
    `);
  });
});
