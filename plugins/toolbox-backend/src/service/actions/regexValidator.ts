import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createRegexValidatorAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'validate-regex',
    title: 'Validate Regex',
    description: 'Test regex patterns against input text and extract matches',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          text: z.string().describe('Input text to test against'),
          pattern: z.string().describe('Regular expression pattern'),
          flags: z
            .string()
            .optional()
            .default('gim')
            .describe(
              'Regex flags (g=global, i=case insensitive, m=multiline)',
            ),
        }),
      output: z =>
        z.object({
          isValid: z.boolean().describe('Whether the regex pattern is valid'),
          hasMatches: z
            .boolean()
            .describe('Whether the pattern matches the input'),
          matches: z
            .array(
              z.object({
                match: z.string().describe('Matched text'),
                index: z.number().describe('Index of the match'),
                groups: z.array(z.string()).describe('Capture groups'),
              }),
            )
            .describe('Array of matches found'),
          error: z
            .string()
            .optional()
            .describe('Error message if pattern is invalid'),
        }),
    },
    action: async ({ input }) => {
      const { text, pattern, flags } = input;
      try {
        const regex = new RegExp(pattern, flags);
        const matches: Array<{
          match: string;
          index: number;
          groups: string[];
        }> = [];

        if (flags.includes('g')) {
          // Use matchAll for global patterns to avoid infinite loops
          const matchIterator = text.matchAll(regex);
          for (const match of matchIterator) {
            matches.push({
              match: match[0],
              index: match.index!,
              groups: match.slice(1),
            });

            // Safety limit to prevent excessive matches
            if (matches.length >= 10000) {
              break;
            }
          }
        } else {
          // For non-global patterns, use exec once
          const match = regex.exec(text);
          if (match) {
            matches.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
            });
          }
        }

        return {
          output: {
            isValid: true,
            hasMatches: matches.length > 0,
            matches,
          },
        };
      } catch (error) {
        return {
          output: {
            isValid: false,
            hasMatches: false,
            matches: [],
            error: error.message,
          },
        };
      }
    },
  });
};
