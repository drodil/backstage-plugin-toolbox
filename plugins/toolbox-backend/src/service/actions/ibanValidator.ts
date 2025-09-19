import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import * as IBAN from 'iban';

export const createIbanValidatorAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'validate-iban',
    title: 'Validate IBAN',
    description: 'Validate International Bank Account Number (IBAN) codes',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          iban: z.string().describe('IBAN code to validate'),
        }),
      output: z =>
        z.object({
          isValid: z.boolean().describe('Whether the IBAN is valid'),
          bban: z
            .string()
            .optional()
            .describe('Basic Bank Account Number (BBAN)'),
          electronic: z
            .string()
            .optional()
            .describe('Electronic format of IBAN'),
          country: z.string().optional().describe('Country code'),
          checkDigits: z.string().optional().describe('Check digits'),
        }),
    },
    action: async ({ input }) => {
      const { iban } = input;
      try {
        const isValid = IBAN.isValid(iban);

        if (!isValid) {
          return {
            output: {
              isValid: false,
            },
          };
        }

        const bban = IBAN.toBBAN(iban);
        const electronic = IBAN.electronicFormat(iban);
        const country = iban.substring(0, 2);
        const checkDigits = iban.substring(2, 4);

        return {
          output: {
            isValid: true,
            bban,
            electronic,
            country,
            checkDigits,
          },
        };
      } catch (error) {
        return {
          output: {
            isValid: false,
          },
        };
      }
    },
  });
};
