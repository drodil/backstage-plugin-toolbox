import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

// HTML entities mapping for encoding/decoding
const htmlEntities: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

const htmlEntitiesReverse: { [key: string]: string } = Object.fromEntries(
  Object.entries(htmlEntities).map(([key, value]) => [value, key]),
);

export const createHtmlEntitiesEncoderAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'encode-decode-html-entities',
    title: 'Encode/Decode HTML Entities',
    description: 'Encode or decode HTML entities in text',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          data: z.string().describe('HTML data to encode or decode'),
          mode: z.enum(['encode', 'decode']).describe('Operation mode'),
        }),
      output: z =>
        z.object({
          result: z.string().describe('Encoded or decoded HTML'),
        }),
    },
    action: async ({ input }) => {
      const { data, mode } = input;
      try {
        let result: string;
        if (mode === 'encode') {
          result = data.replace(
            /[&<>"'/]/g,
            match => htmlEntities[match] || match,
          );
        } else {
          result = data.replace(
            /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
            match => htmlEntitiesReverse[match] || match,
          );
        }
        return { output: { result } };
      } catch (error) {
        throw new Error(`Failed to ${mode} HTML entities: ${error.message}`);
      }
    },
  });
};
