import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import {
  toolboxToolExtensionPoint,
  ToolRequestHandler,
} from '@drodil/backstage-plugin-toolbox-node';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { registerActions } from './service/actions';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';

/**
 * toolboxPlugin backend plugin
 *
 * @public
 */
export const toolboxPlugin = createBackendPlugin({
  pluginId: 'toolbox',
  register(env) {
    const handlers: ToolRequestHandler[] = [];

    env.registerExtensionPoint(toolboxToolExtensionPoint, {
      addToolRequestHandler(handler) {
        handlers.push(handler);
      },
    });

    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        actionsRegistry: actionsRegistryServiceRef,
        catalog: catalogServiceRef,
      },
      async init({ httpRouter, logger, config, actionsRegistry, catalog }) {
        httpRouter.use(
          await createRouter({
            logger,
            handlers,
            config,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '*',
          allow: 'unauthenticated',
        });

        registerActions({ actionsRegistry, catalog, config });
      },
    });
  },
});
