import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createNumberBaseConverterAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'convert-number-base',
    title: 'Convert Number Base',
    description:
      'Convert numbers between different bases (binary, octal, decimal, hexadecimal)',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          value: z.string().describe('Number value to convert'),
          fromBase: z
            .enum(['2', '8', '10', '16'])
            .describe(
              'Source base (2=binary, 8=octal, 10=decimal, 16=hexadecimal)',
            ),
        }),
      output: z =>
        z.object({
          binary: z.string().describe('Binary representation'),
          octal: z.string().describe('Octal representation'),
          decimal: z.string().describe('Decimal representation'),
          hexadecimal: z.string().describe('Hexadecimal representation'),
        }),
    },
    action: async ({ input }) => {
      const { value, fromBase } = input;
      try {
        const base = parseInt(fromBase, 10);
        const decimalValue = parseInt(value, base);

        if (isNaN(decimalValue)) {
          throw new Error(`Invalid number format for base ${base}`);
        }

        return {
          output: {
            binary: decimalValue.toString(2),
            octal: decimalValue.toString(8),
            decimal: decimalValue.toString(10),
            hexadecimal: decimalValue.toString(16).toUpperCase(),
          },
        };
      } catch (error) {
        throw new Error(`Failed to convert number base: ${error.message}`);
      }
    },
  });
};
