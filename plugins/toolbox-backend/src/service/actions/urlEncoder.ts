import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createUrlEncoderAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'encode-url',
    title: 'Encode/Decode URL',
    description: 'Encode or decode URL data with special character handling',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          data: z.string().describe('URL data to encode or decode'),
          mode: z.enum(['encode', 'decode']).describe('Operation mode'),
          specialCharsMode: z
            .enum(['withSpecialCharacters', 'withoutSpecialCharacters'])
            .optional()
            .default('withoutSpecialCharacters')
            .describe('Special character handling mode'),
        }),
      output: z =>
        z.object({
          result: z.string().describe('Encoded or decoded URL'),
        }),
    },
    action: async ({ input }) => {
      const { data, mode, specialCharsMode } = input;
      try {
        let result: string;
        if (mode === 'encode') {
          result =
            specialCharsMode === 'withSpecialCharacters'
              ? encodeURIComponent(data)
              : encodeURI(data);
        } else {
          result =
            specialCharsMode === 'withSpecialCharacters'
              ? decodeURIComponent(data)
              : decodeURI(data);
        }
        return { output: { result } };
      } catch (error) {
        throw new Error(`Failed to ${mode} URL: ${error.message}`);
      }
    },
  });
};
