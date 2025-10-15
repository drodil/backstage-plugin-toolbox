import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createBackstageIconsAction = (options: {
    actionsRegistry: ActionsRegistryService;
  }) => {
    const { actionsRegistry } = options;
    actionsRegistry.register({
        name: 'icons-list',
        title: 'Icons list',
        description: 'Shows all Backstage icons',
        attributes: {
          readOnly: true,
          idempotent: true,
          destructive: false,
        },
        schema: {
            input: z => z.object({}),
            output: z =>
              z.object({
                icons: z.array(z.string()).describe('List of available icons'),
              }),
          },
        action: async () => {
            // Return list of Backstage icons
            return { output: { icons: [] } };
        },
    });
  };