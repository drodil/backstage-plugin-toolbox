import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { createCardExtension } from '@backstage/plugin-home';
import { defaultTools } from './components/Root/tools';

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

export const ToolboxHomepageCard = toolboxPlugin.provide(
  createCardExtension<{ toolId?: string }>({
    name: 'ToolboxHomepageCard',
    title: 'Toolbox',
    description: 'Shows wanted tool from the toolbox',
    components: () => import('./components/HomepageCard'),
    layout: {
      height: { minRows: 4 },
      width: { minColumns: 4 },
    },
    settings: {
      schema: {
        title: 'Toolbox settings',
        type: 'object',
        properties: {
          toolId: {
            title: 'Tool',
            type: 'string',
            enum: defaultTools.map(tool => tool.id),
            default: 'any',
          },
        },
      },
    },
  }),
);
