import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { createCardExtension } from '@backstage/plugin-home-react';
import { defaultTools } from './components/Root';
import { toolboxApiRef, ToolboxClient } from './api';

export const toolboxPlugin = createPlugin({
  id: 'toolbox',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: toolboxApiRef,
      deps: { fetchApi: fetchApiRef, discoveryApi: discoveryApiRef },
      factory: ({ fetchApi, discoveryApi }) =>
        new ToolboxClient({ fetchApi, discoveryApi }),
    }),
  ],
});

export const ToolboxPage = toolboxPlugin.provide(
  createRoutableExtension({
    name: 'ToolboxPage',
    component: () => import('./components/Root').then(m => m.Root),
    mountPoint: rootRouteRef,
  }),
);

export const ToolsContainer = toolboxPlugin.provide(
  createComponentExtension({
    name: 'ToolboxContainer',
    component: {
      lazy: () => import('./components/Root').then(m => m.ToolsContainer),
    },
  }),
);

export const ToolContainer = toolboxPlugin.provide(
  createComponentExtension({
    name: 'ToolContainer',
    component: {
      lazy: () => import('./components/Root').then(m => m.ToolContainer),
    },
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
