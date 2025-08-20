import {
  ApiBlueprint,
  createFrontendPlugin,
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
  extensions: [toolboxApi, toolboxPage],
});

export { toolboxTranslationRef } from './translation';
