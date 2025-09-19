import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import YAML from 'yaml';

export const createYamlToJsonAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'convert-yaml-to-json',
    title: 'Convert YAML to JSON',
    description: 'Convert YAML data to JSON format',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          yaml: z.string().describe('YAML data as a string'),
          spaces: z
            .number()
            .optional()
            .default(4)
            .describe('Number of spaces for JSON indentation'),
        }),
      output: z =>
        z.object({
          json: z.string().describe('JSON data'),
        }),
    },
    action: async ({ input }) => {
      const { yaml, spaces } = input;
      try {
        const obj = YAML.parse(yaml);
        const json = JSON.stringify(obj, null, spaces);
        return { output: { json } };
      } catch (error) {
        throw new Error(`Failed to convert YAML to JSON: ${error.message}`);
      }
    },
  });
};
