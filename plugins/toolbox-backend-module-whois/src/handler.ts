import { ToolRequestHandler } from '@drodil/backstage-plugin-toolbox-node';
import { Request, Response } from 'express';

export class WhoisHandler implements ToolRequestHandler {
  getToolName(): string {
    return 'whois';
  }

  async handleRequest(
    request: Request<any>,
    response: Response,
  ): Promise<void> {
    const domain = request.body.domain;
    if (!domain) {
      response.status(404).json({ error: 'Domain missing' });
      return;
    }
    try {
      const whoiser = require('whoiser');
      const data = await whoiser(domain);
      response.json(data);
    } catch (error) {
      response.status(400).json({ error: 'Invalid domain' });
    }
  }
}
