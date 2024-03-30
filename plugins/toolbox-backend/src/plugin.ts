import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import {
  toolboxToolExtensionPoint,
  ToolRequestHandler,
} from '@drodil/backstage-plugin-toolbox-node';

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
        logger: coreServices.logger,
      },
      async init({ httpRouter, logger }) {
        httpRouter.use(
          await createRouter({
            logger,
            handlers,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '*',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
