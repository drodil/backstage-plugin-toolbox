import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createTextDiffAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'diff-text',
    title: 'Compare Text Diff',
    description: 'Compare two texts and identify differences',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          original: z.string().describe('Original text'),
          modified: z.string().describe('Modified text'),
          ignoreWhitespace: z
            .boolean()
            .default(false)
            .describe('Ignore whitespace differences'),
          ignoreCase: z
            .boolean()
            .default(false)
            .describe('Ignore case differences'),
        }),
      output: z =>
        z.object({
          identical: z.boolean().describe('Whether the texts are identical'),
          differences: z
            .array(
              z.object({
                type: z
                  .enum(['added', 'removed', 'unchanged'])
                  .describe('Type of change'),
                lineNumber: z.number().describe('Line number'),
                content: z.string().describe('Line content'),
              }),
            )
            .describe('Line-by-line differences'),
          stats: z.object({
            linesAdded: z.number().describe('Number of lines added'),
            linesRemoved: z.number().describe('Number of lines removed'),
            linesUnchanged: z.number().describe('Number of lines unchanged'),
          }),
        }),
    },
    action: async ({ input }) => {
      const { original, modified, ignoreWhitespace, ignoreCase } = input;
      try {
        // Preprocess texts if needed
        let processedOriginal = original;
        let processedModified = modified;

        if (ignoreCase) {
          processedOriginal = processedOriginal.toLowerCase();
          processedModified = processedModified.toLowerCase();
        }

        if (ignoreWhitespace) {
          processedOriginal = processedOriginal.replace(/\s+/g, ' ').trim();
          processedModified = processedModified.replace(/\s+/g, ' ').trim();
        }

        const originalLines = processedOriginal.split(/\r\n|\r|\n/);
        const modifiedLines = processedModified.split(/\r\n|\r|\n/);

        // Simple line-by-line comparison (could be enhanced with LCS algorithm)
        const differences: Array<{
          type: 'added' | 'removed' | 'unchanged';
          lineNumber: number;
          content: string;
        }> = [];

        let linesAdded = 0;
        let linesRemoved = 0;
        let linesUnchanged = 0;

        const maxLines = Math.max(originalLines.length, modifiedLines.length);

        for (let i = 0; i < maxLines; i++) {
          const originalLine = originalLines[i] || '';
          const modifiedLine = modifiedLines[i] || '';

          if (originalLine === modifiedLine) {
            differences.push({
              type: 'unchanged',
              lineNumber: i + 1,
              content: originalLine,
            });
            linesUnchanged++;
          } else {
            if (originalLines[i] !== undefined) {
              differences.push({
                type: 'removed',
                lineNumber: i + 1,
                content: originalLine,
              });
              linesRemoved++;
            }
            if (modifiedLines[i] !== undefined) {
              differences.push({
                type: 'added',
                lineNumber: i + 1,
                content: modifiedLine,
              });
              linesAdded++;
            }
          }
        }

        const identical = processedOriginal === processedModified;

        return {
          output: {
            identical,
            differences,
            stats: {
              linesAdded,
              linesRemoved,
              linesUnchanged,
            },
          },
        };
      } catch (error) {
        throw new Error(`Failed to compare texts: ${error.message}`);
      }
    },
  });
};
