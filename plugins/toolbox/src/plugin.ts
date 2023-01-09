import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const toolboxPlugin = createPlugin({
  id: 'toolbox',
  routes: {
    root: rootRouteRef,
  },
});

export const ToolboxPage = toolboxPlugin.provide(
  createRoutableExtension({
    name: 'ToolboxPage',
    component: () => import('./components/Root').then(m => m.Root),
    mountPoint: rootRouteRef,
  }),
);
