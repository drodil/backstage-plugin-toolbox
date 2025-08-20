import {
  ApiBlueprint,
  createFrontendPlugin,
  NavItemBlueprint,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { toolboxApiRef, ToolboxClient } from './api';
import { rootRouteRef } from './routes.ts';
import CardTravel from '@mui/icons-material/CardTravel';

const toolboxApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: toolboxApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory({ discoveryApi, fetchApi }) {
        return new ToolboxClient({ discoveryApi, fetchApi });
      },
    }),
});

const toolboxPage = PageBlueprint.make({
  params: {
    path: '/toolbox',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    loader: () =>
      import('./components/Root').then(m => compatWrapper(<m.Root />)),
  },
});

/** @alpha */
export const toolboxNavItem = NavItemBlueprint.make({
  params: {
    title: 'Toolbox',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    icon: CardTravel,
  },
});

/**
 * Backstage frontend plugin.
 *
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'toolbox',
  info: { packageJson: () => import('../package.json') },
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
  }),
  extensions: [toolboxApi, toolboxPage, toolboxNavItem],
});

export { toolboxTranslationRef } from './translation';
