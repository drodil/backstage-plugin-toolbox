import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import YAML from 'yaml';

export const createJsonToYamlAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'convert-json-to-yaml',
    title: 'Convert JSON to YAML',
    description: 'Convert JSON data to YAML format',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          json: z.string().describe('JSON data as a string'),
        }),
      output: z =>
        z.object({
          yaml: z.string().describe('YAML data'),
        }),
    },
    action: async ({ input }) => {
      const { json } = input;
      try {
        const obj = JSON.parse(json);
        const yaml = YAML.stringify(obj);
        return { output: { yaml } };
      } catch (error) {
        throw new Error(`Failed to convert JSON to YAML: ${error.message}`);
      }
    },
  });
};
