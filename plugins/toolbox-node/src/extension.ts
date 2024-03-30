import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { ToolRequestHandler } from './ToolRequestHandler';

export interface ToolboxToolExtensionPoint {
  addToolRequestHandler(requestHandler: ToolRequestHandler): void;
}

export const toolboxToolExtensionPoint =
  createExtensionPoint<ToolboxToolExtensionPoint>({
    id: 'toolbox.tool',
  });
