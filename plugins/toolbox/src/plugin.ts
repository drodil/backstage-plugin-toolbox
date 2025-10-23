import type { TFunction } from 'i18next';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { getSortedTools, getToolTitle } from './utils/tools';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { ToolboxCardRenderer } from './components/HomepageCard';
import { createCardExtension } from '@backstage/plugin-home-react';
import { toolboxApiRef, ToolboxClient } from './api';
import { defaultTools } from './components/Root';

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

export interface ToolboxHomepageCardOptions {
  name?: string;
  title?: string;
  description?: string;
  popupTitle?: string;
  selectorTitle?: string;
  tools?: Tool[];
  extraTools?: Tool[];
  favorites?: string[];
  backendTools?: string[];
  toolFilterFunction?: (tool: Tool) => boolean;
  favoritesCategory?: string;
  t?: TFunction;
}

export function toolboxHomepageCardFactory(
  options: ToolboxHomepageCardOptions = {},
) {
  const {
    name = 'ToolboxHomepageCard',
    title = 'Toolbox',
    description = 'Shows tool in the toolbox',
    popupTitle = 'Toolbox settings',
    selectorTitle = 'Tools',
    tools,
    extraTools,
    favorites,
    backendTools,
    toolFilterFunction,
    favoritesCategory,
    t,
  } = options;

  const sortedTools = getSortedTools({
    extraTools,
    tools,
    favorites,
    backendTools,
    toolFilterFunction,
    favoritesCategory: favoritesCategory ?? 'Favorites',
    t,
  });
  const titleValue = t
    ? t('toolbox.homepageCard.title', { defaultValue: title })
    : title;
  const descriptionValue = t
    ? t('toolbox.homepageCard.description', { defaultValue: description })
    : description;
  const popupTitleValue = t
    ? t('toolbox.homepageCard.settingsTitle', { defaultValue: popupTitle })
    : popupTitle;
  const selectorTitleValue = t
    ? t('toolbox.homepageCard.selectToolText', { defaultValue: selectorTitle })
    : selectorTitle;
  return toolboxPlugin.provide(
    createCardExtension<{ toolId?: string }>({
      name,
      title: titleValue,
      description: descriptionValue,
      components: () =>
        import('./components/HomepageCard').then(m => ({
          Renderer: ToolboxCardRenderer,
          Content: m.Content,
        })),
      layout: {
        height: { minRows: 4 },
        width: { minColumns: 4 },
      },
      settings: {
        schema: {
          title: popupTitleValue,
          type: 'object',
          properties: {
            toolId: {
              title: selectorTitleValue,
              type: 'string',
              oneOf: sortedTools.map(tool => ({
                const: tool.id,
                title: getToolTitle(tool, t),
              })),
              default: 'any',
            },
          },
        },
      },
    }),
  );
}

export const ToolboxHomepageCard = toolboxPlugin.provide(
  createCardExtension<{ toolId?: string }>({
    name: 'ToolboxHomepageCard',
    title: 'Toolbox',
    description: 'Shows wanted tool from the toolbox',
    components: () =>
      import('./components/HomepageCard').then(m => ({
        Renderer: ToolboxCardRenderer,
        Content: m.Content,
      })),
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
