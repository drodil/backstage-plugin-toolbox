import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import csvToJson from 'csvtojson';

export const createCsvToJsonAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'convert-csv-to-json',
    title: 'Convert CSV to JSON',
    description: 'Convert CSV data to JSON format',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          csv: z.string().describe('CSV data as a string'),
          spaces: z
            .number()
            .optional()
            .default(2)
            .describe('Number of spaces for JSON indentation'),
        }),
      output: z =>
        z.object({
          json: z.string().describe('JSON data'),
        }),
    },
    action: async ({ input }) => {
      const { csv, spaces } = input;
      const obj = await csvToJson().fromString(csv);
      return { output: { json: JSON.stringify(obj, null, spaces) } };
    },
  });
};
