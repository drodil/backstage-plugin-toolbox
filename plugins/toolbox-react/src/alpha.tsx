import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionDataRef,
  createExtensionInput,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
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
  config: {
    schema: {
      id: z => z.string().optional(),
      displayName: z => z.string().optional(),
      aliases: z => z.array(z.string()).optional(),
      showOpenInNewWindowButton: z => z.boolean().optional(),
      showFavoriteButton: z => z.boolean().optional(),
      description: z => z.string().optional(),
      category: z => z.string().optional(),
      requiresBackend: z => z.boolean().optional(),
      isNew: z => z.boolean().optional(),
    },
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
      isNew?: boolean
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
