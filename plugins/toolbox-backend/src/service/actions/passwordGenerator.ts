import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { randomBytes } from 'crypto';

export const createPasswordGeneratorAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'generate-password',
    title: 'Generate Password',
    description: 'Generate secure passwords with customizable options',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          length: z
            .number()
            .min(8)
            .max(128)
            .default(16)
            .describe('Password length'),
          count: z
            .number()
            .min(1)
            .max(50)
            .default(1)
            .describe('Number of passwords to generate'),
          includeUppercase: z
            .boolean()
            .default(true)
            .describe('Include uppercase letters'),
          includeLowercase: z
            .boolean()
            .default(true)
            .describe('Include lowercase letters'),
          includeNumbers: z.boolean().default(true).describe('Include numbers'),
          includeSymbols: z.boolean().default(true).describe('Include symbols'),
          excludeSimilar: z
            .boolean()
            .default(false)
            .describe('Exclude similar characters (0, O, l, I, etc.)'),
        }),
      output: z =>
        z.object({
          passwords: z.array(z.string()).describe('Generated passwords'),
        }),
    },
    action: async ({ input }) => {
      const {
        length,
        count,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
      } = input;

      try {
        let charset = '';

        if (includeUppercase) {
          charset += excludeSimilar
            ? 'ABCDEFGHJKLMNPQRSTUVWXYZ'
            : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (includeLowercase) {
          charset += excludeSimilar
            ? 'abcdefghijkmnopqrstuvwxyz'
            : 'abcdefghijklmnopqrstuvwxyz';
        }
        if (includeNumbers) {
          charset += excludeSimilar ? '23456789' : '0123456789';
        }
        if (includeSymbols) {
          charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }

        if (charset === '') {
          throw new Error('At least one character type must be selected');
        }

        const passwords: string[] = [];

        for (let i = 0; i < count; i++) {
          let password = '';
          const bytes = randomBytes(length);

          for (let j = 0; j < length; j++) {
            password += charset[bytes[j] % charset.length];
          }

          passwords.push(password);
        }

        return { output: { passwords } };
      } catch (error) {
        throw new Error(`Failed to generate passwords: ${error.message}`);
      }
    },
  });
};
