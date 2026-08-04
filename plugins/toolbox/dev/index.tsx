import { createApp } from '@backstage/frontend-defaults';
import { createRoot } from 'react-dom/client';
import { CatalogApiMock } from './CatalogApiMock';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import catalogPlugin from '@backstage/plugin-catalog/alpha';

import toolboxPlugin from '../src';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { ToolboxToolBlueprint } from '@drodil/backstage-plugin-toolbox-react';
import homePlugin from '@backstage/plugin-home/alpha';

// eslint-disable-next-line @backstage/no-ui-css-imports-in-non-frontend
import '@backstage/ui/css/styles.css';

const extraTool = ToolboxToolBlueprint.make({
  params: {
    id: 'extra-tool',
    displayName: 'Extra Tool',
    loader: () => Promise.resolve(<div>Extra tool</div>),
  },
});

const myCatalogPlugin = catalogPlugin.withOverrides({
  extensions: [
    catalogPlugin.getExtension('api:catalog').override({
      params: defineParams =>
        defineParams({
          api: catalogApiRef,
          deps: {},
          factory: () => new CatalogApiMock(),
        }),
    }),
  ],
});

const myModule = createFrontendModule({
  pluginId: 'toolbox',
  extensions: [extraTool],
});

const app = createApp({
  features: [toolboxPlugin, myModule, myCatalogPlugin, homePlugin],
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(app.createRoot());
