import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { Parser } from '@json2csv/plainjs';

export const createJsonToCsvAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'convert-json-to-csv',
    title: 'Convert JSON to CSV',
    description: 'Convert JSON data to CSV format',
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
          csv: z.string().describe('CSV data'),
        }),
    },
    action: async ({ input }) => {
      const { json } = input;
      try {
        const obj = JSON.parse(json);
        const parser = new Parser();
        const csv = parser.parse(obj);
        return { output: { csv } };
      } catch (error) {
        throw new Error(`Failed to convert JSON to CSV: ${error.message}`);
      }
    },
  });
};
