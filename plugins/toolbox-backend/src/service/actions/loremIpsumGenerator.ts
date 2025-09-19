import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { faker } from '@faker-js/faker';

export const createLoremIpsumGeneratorAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'generate-lorem-ipsum',
    title: 'Generate Lorem Ipsum',
    description:
      'Generate various types of random data (text, numbers, UUIDs, etc.)',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          type: z
            .enum([
              'line',
              'paragraph',
              'slug',
              'word',
              'hack',
              'hex',
              'datetime',
              'number',
              'string',
              'uuid',
              'ipv4',
              'ipv6',
              'mac',
              'domain',
              'password',
            ])
            .describe('Type of data to generate'),
          count: z
            .number()
            .min(1)
            .max(100)
            .default(1)
            .describe('Number of items to generate'),
        }),
      output: z =>
        z.object({
          result: z.array(z.string()).describe('Generated data array'),
        }),
    },
    action: async ({ input }) => {
      const { type, count } = input;
      try {
        let result: string[] = [];

        switch (type) {
          case 'line':
            result = faker.lorem.lines(count).split('\n');
            break;
          case 'paragraph':
            result = faker.lorem.paragraphs(count, '\n').split('\n');
            break;
          case 'slug':
            result = Array.from({ length: count }, () => faker.lorem.slug());
            break;
          case 'word':
            result = faker.lorem.words(count).split(' ');
            break;
          case 'hack':
            result = Array.from({ length: count }, () => faker.hacker.phrase());
            break;
          case 'hex':
            result = Array.from({ length: count }, () =>
              faker.string.hexadecimal({
                length: Math.floor(Math.random() * 50) + 1,
                casing: 'lower',
              }),
            );
            break;
          case 'datetime':
            result = Array.from({ length: count }, () =>
              faker.date.anytime().toString(),
            );
            break;
          case 'number':
            result = Array.from({ length: count }, () =>
              faker.number.int({ min: 1, max: 100000000000000000 }).toString(),
            );
            break;
          case 'string':
            result = Array.from({ length: count }, () =>
              faker.string.sample(Math.floor(Math.random() * 90) + 10),
            );
            break;
          case 'uuid':
            result = Array.from({ length: count }, () => faker.string.uuid());
            break;
          case 'ipv4':
            result = Array.from({ length: count }, () => faker.internet.ipv4());
            break;
          case 'ipv6':
            result = Array.from({ length: count }, () => faker.internet.ipv6());
            break;
          case 'mac':
            result = Array.from({ length: count }, () => faker.internet.mac());
            break;
          case 'domain':
            result = Array.from({ length: count }, () =>
              faker.internet.domainName(),
            );
            break;
          case 'password':
            result = Array.from({ length: count }, () =>
              faker.internet.password({
                length: Math.floor(Math.random() * 20) + 8,
                memorable: false,
              }),
            );
            break;
          default:
            throw new Error(`Unsupported type: ${type}`);
        }

        return { output: { result } };
      } catch (error) {
        throw new Error(
          `Failed to generate lorem ipsum data: ${error.message}`,
        );
      }
    },
  });
};
