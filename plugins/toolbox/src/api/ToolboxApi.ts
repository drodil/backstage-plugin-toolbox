import { createApiRef } from '@backstage/core-plugin-api';

export interface ToolboxApi {
  getBackendTools(): Promise<string[]>;

  toolRequest(toolName: string, request: any): Promise<any>;

  toolJsonRequest(toolName: string, data: any): Promise<unknown>;
}

export const toolboxApiRef = createApiRef<ToolboxApi>({
  id: 'plugin.toolbox.service',
});
