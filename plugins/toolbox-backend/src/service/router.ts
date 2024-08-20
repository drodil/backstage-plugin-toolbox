import { LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { ToolRequestHandler } from '@drodil/backstage-plugin-toolbox-node';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { Config } from '@backstage/config';

export interface RouterOptions {
  config: Config;
  logger: LoggerService;
  handlers: ToolRequestHandler[];
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.get('/tools', (_, response) => {
    response.json({
      tools: options.handlers.map(h => h.getToolName()),
    });
  });

  router.all('/:toolId', async (request, response) => {
    const toolId = request.params.toolId;
    const handler = options.handlers.find(h => h.getToolName() === toolId);
    if (!handler) {
      response.status(404).json({ error: 'Tool not found' });
      return;
    }

    try {
      await handler.handleRequest(request, response);
    } catch (error) {
      logger.error('Error handling request', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });

  router.use(MiddlewareFactory.create({ logger, config }).error);
  return router;
}
