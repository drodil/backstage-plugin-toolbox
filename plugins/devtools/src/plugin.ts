import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const devtoolsPlugin = createPlugin({
  id: 'devtools',
  routes: {
    root: rootRouteRef,
  },
});

export const DevtoolsPage = devtoolsPlugin.provide(
  createRoutableExtension({
    name: 'DevtoolsPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
