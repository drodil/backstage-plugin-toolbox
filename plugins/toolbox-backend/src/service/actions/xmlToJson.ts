import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { xml2json } from 'xml-js';

export const createXmlToJsonAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'convert-xml-to-json',
    title: 'Convert XML to JSON',
    description: 'Convert XML data to JSON format',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          xml: z.string().describe('XML data as a string'),
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
      const { xml, spaces } = input;
      try {
        const json = xml2json(xml);
        const obj = JSON.parse(json);
        const formattedJson = JSON.stringify(obj, null, spaces);
        return { output: { json: formattedJson } };
      } catch (error) {
        throw new Error(`Failed to convert XML to JSON: ${error.message}`);
      }
    },
  });
};
