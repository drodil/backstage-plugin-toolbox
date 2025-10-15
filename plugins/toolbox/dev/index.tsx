import { createDevApp } from '@backstage/dev-utils';
import {
  defaultTools,
  ToolboxPage,
  ToolContainer,
  ToolsContainer,
} from '../src';
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
    element: <ToolsContainer />,
    title: 'Container Page',
    path: '/toolbox-container',
  })
  .addPage({
    element: <ToolContainer tool={defaultTools[0]} />,
    title: 'Tool Page',
    path: '/tool',
  })
  .addPage({
    element: <HomePage />,
    title: 'Home Page',
    path: '/home',
  })
  .render();

// NEW FRONTEND SYSTEM
/** import { createApp } from '@backstage/frontend-defaults';
import { createRoot } from 'react-dom/client';

import plugin from '../src/alpha';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { ToolboxToolBlueprint } from '@drodil/backstage-plugin-toolbox-react/alpha';

const extraTool = ToolboxToolBlueprint.make({
  params: {
    id: 'extra-tool',
    displayName: 'Extra Tool',
    loader: () => Promise.resolve(<div>Extra tool</div>),
  },
});

const myModule = createFrontendModule({
  pluginId: 'toolbox',
  extensions: [extraTool],
});

const app = createApp({
  features: [plugin, myModule],
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(app.createRoot());
*/
