import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

const charCodeMap = {
  '\\n': 13,
  '\\t': 9,
  '\\b': 8,
  '\\\\': 220,
  "\\'": 222,
  '\\"': 34,
};
export const createBackslashEncoderAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'escape-unescape-backslash',
    title: 'Escape/Unescape Backslash',
    description: 'Escape or unescape backslash characters',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          data: z.string().describe('Data to escape or unescape'),
          mode: z.enum(['escape', 'unescape']).describe('Operation mode'),
        }),
      output: z =>
        z.object({
          result: z.string().describe('Escaped or unescaped result'),
        }),
    },
    action: async ({ input }) => {
      const { data, mode } = input;
      try {
        let result: string;
        if (mode === 'escape') {
          const str = JSON.stringify(input);
          result = str.substring(1, str.length - 1);
        } else {
          result = data;
          for (const [key, value] of Object.entries(charCodeMap)) {
            result = result.replaceAll(key, String.fromCharCode(value));
          }
        }
        return { output: { result } };
      } catch (error) {
        throw new Error(
          `Failed to ${mode} backslash characters: ${error.message}`,
        );
      }
    },
  });
};
