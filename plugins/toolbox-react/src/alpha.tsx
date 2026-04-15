import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionDataRef,
  createExtensionInput,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { z } from 'zod';
import { Tool } from './types';

export const toolDataRef = createExtensionDataRef<Tool>().with({
  id: 'toolbox.tool',
});

export const ToolboxToolBlueprint = createExtensionBlueprint({
  kind: 'toolbox-tool',
  attachTo: { id: 'page:toolbox', input: 'tools' },
  output: [toolDataRef],
  inputs: {
    headerButtons: createExtensionInput([coreExtensionData.reactElement], {
      required: false,
      singleton: false,
    }),
  },
  configSchema: {
    id: z.string().optional(),
    displayName: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    showOpenInNewWindowButton: z.boolean().optional(),
    showFavoriteButton: z.boolean().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    requiresBackend: z.boolean().optional(),
  },
  dataRefs: { tool: toolDataRef },
  *factory(
    params: {
      id: string;
      displayName: string;
      description?: string;
      aliases?: string[];
      category?: string;
      requiresBackend?: boolean;
      showFavoriteButton?: boolean;
      showOpenInNewWindowButton?: boolean;
      loader: () => Promise<JSX.Element>;
    },
    { config, inputs, node },
  ) {
    const headerButtons = inputs.headerButtons.map(button =>
      button.get(coreExtensionData.reactElement),
    );
    yield toolDataRef({
      ...params,
      ...config,
      name: params.displayName,
      id: params.id,
      component: ExtensionBoundary.lazy(node, params.loader),
      headerButtons,
    });
  },
});
