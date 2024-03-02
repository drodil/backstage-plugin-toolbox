import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { ToolboxPage } from '../src/plugin';
import {
  AnyApiFactory,
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { rootRouteRef } from '../src/routes';
import { CatalogApiMock } from './CatalogApiMock';
import { HomePage } from './HomePage';

const extraToolExample = {
  id: 'extra-test',
  name: 'Extra',
  component: <div>Extra tool</div>,
};

const apiFactories: AnyApiFactory[] = [
  createApiFactory({
    api: catalogApiRef,
    deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
    factory: () => new CatalogApiMock(),
  }),
];

const toolboxDevPlugin = createPlugin({
  id: 'toolboxDev',
  routes: {
    root: rootRouteRef,
  },
  apis: apiFactories,
});

createDevApp()
  .registerPlugin(toolboxDevPlugin)
  .addPage({
    element: <ToolboxPage extraTools={[extraToolExample]} />,
    title: 'Root Page',
    path: '/toolbox',
  })
  .addPage({
    element: (
      <ToolboxPage
        welcomePage={
          <p>
            This is a customized home page for toolbox. Use your imagination!
          </p>
        }
      />
    ),
    title: 'Custom Page',
    path: '/toolbox-custom',
  })
  .addPage({
    element: <HomePage />,
    title: 'Home Page',
    path: '/home',
  })
  .render();
