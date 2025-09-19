import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

const ANALYZED_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 :;,.!?*+^${}()|/\\';

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createStringAnalyzerAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'analyze-string',
    title: 'Analyze String',
    description:
      'Analyze text for character counts, lines, words, and character frequency',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          text: z.string().describe('Text to analyze'),
        }),
      output: z =>
        z.object({
          characters: z.number().describe('Total number of characters'),
          lines: z.number().describe('Total number of lines'),
          words: z.number().describe('Total number of words'),
          characterFrequency: z
            .array(
              z.object({
                char: z.string().describe('Character or character type'),
                count: z.number().describe('Frequency count'),
              }),
            )
            .describe('Character frequency analysis'),
        }),
    },
    action: async ({ input }) => {
      const { text } = input;
      try {
        const characters = text.length;
        const lines = text ? text.split(/\r\n|\r|\n/g).length : 0;
        const words = text
          ? text.split(/\s+/).filter(word => word.length > 0).length
          : 0;

        const characterFrequency = [];
        let totalCount = 0;

        for (const char of ANALYZED_CHARS) {
          const count =
            text.split(new RegExp(escapeRegex(char), 'gi')).length - 1;
          totalCount += count;
          characterFrequency.push({
            char: char === ' ' ? 'Whitespace' : char,
            count,
          });
        }

        // Add count for other characters not in the analyzed set
        characterFrequency.push({
          char: 'Others',
          count: text.length - totalCount,
        });

        return {
          output: {
            characters,
            lines,
            words,
            characterFrequency,
          },
        };
      } catch (error) {
        throw new Error(`Failed to analyze string: ${error.message}`);
      }
    },
  });
};
