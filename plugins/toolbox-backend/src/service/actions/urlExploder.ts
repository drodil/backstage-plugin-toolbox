import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createUrlExploderAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'explode-url',
    title: 'Explode URL',
    description: 'Parse URLs and extract their components',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          url: z.string().describe('URL to parse and explode'),
        }),
      output: z =>
        z.object({
          protocol: z.string().describe('Protocol (e.g., https:)'),
          hostname: z.string().describe('Hostname/domain'),
          port: z.string().describe('Port number'),
          pathname: z.string().describe('Path portion'),
          search: z.string().describe('Query string with ?'),
          hash: z.string().describe('Hash/fragment with #'),
          origin: z.string().describe('Origin (protocol + hostname + port)'),
          username: z.string().describe('Username if present'),
          password: z.string().describe('Password if present'),
          searchParams: z
            .array(
              z.object({
                key: z.string().describe('Parameter name'),
                value: z.string().describe('Parameter value'),
              }),
            )
            .describe('Parsed query parameters'),
        }),
    },
    action: async ({ input }) => {
      const { url: urlString } = input;
      try {
        const url = new URL(urlString);

        const searchParams: { key: string; value: string }[] = [];
        url.searchParams.forEach((value, key) => {
          searchParams.push({ key, value });
        });

        return {
          output: {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            origin: url.origin,
            username: url.username,
            password: url.password,
            searchParams,
          },
        };
      } catch (error) {
        throw new Error(`Failed to parse URL: ${error.message}`);
      }
    },
  });
};
