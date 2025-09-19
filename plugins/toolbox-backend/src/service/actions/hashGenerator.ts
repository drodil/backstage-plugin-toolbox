import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { createHash } from 'crypto';

export const createHashGeneratorAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'generate-hash',
    title: 'Generate Hash',
    description: 'Generate various hash algorithms for input text',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          text: z.string().describe('Text to hash'),
        }),
      output: z =>
        z.object({
          md5: z.string().describe('MD5 hash'),
          sha1: z.string().describe('SHA1 hash'),
          sha256: z.string().describe('SHA256 hash'),
          sha384: z.string().describe('SHA384 hash'),
          sha512: z.string().describe('SHA512 hash'),
        }),
    },
    action: async ({ input }) => {
      const { text } = input;
      try {
        const md5 = createHash('md5').update(text).digest('hex');
        const sha1 = createHash('sha1').update(text).digest('hex');
        const sha256 = createHash('sha256').update(text).digest('hex');
        const sha384 = createHash('sha384').update(text).digest('hex');
        const sha512 = createHash('sha512').update(text).digest('hex');

        return {
          output: {
            md5,
            sha1,
            sha256,
            sha384,
            sha512,
          },
        };
      } catch (error) {
        throw new Error(`Failed to generate hashes: ${error.message}`);
      }
    },
  });
};
