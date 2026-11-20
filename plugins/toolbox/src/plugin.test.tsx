import { renderTestApp } from '@backstage/frontend-test-utils';
import toolboxPlugin from './index';
import { ToolboxApi, toolboxApiRef } from './api';

// The page and tool loaders are lazy, so allow time for the first imports.
const waitOptions = { timeout: 10000 };
const testTimeout = 15000;

const renderToolbox = (backendTools: string[]) => {
  const toolboxApi: ToolboxApi = {
    getBackendTools: async () => backendTools,
    toolRequest: jest.fn(),
    toolJsonRequest: jest.fn(),
  };
  return renderTestApp({
    features: [toolboxPlugin],
    apis: [[toolboxApiRef, toolboxApi]],
    initialRouteEntries: ['/toolbox#whois'],
  });
};

describe('toolbox', () => {
  it('should export plugin', () => {
    expect(toolboxPlugin).toBeDefined();
  });

  it(
    'renders a tool extension that uses the toolbox API',
    async () => {
      const { findByText } = renderToolbox(['whois']);
      expect(await findByText('Lookup', {}, waitOptions)).toBeInTheDocument();
      expect(await findByText('Example', {}, waitOptions)).toBeInTheDocument();
    },
    testTimeout,
  );

  it(
    'does not render a backend tool when the backend does not provide it',
    async () => {
      const { findByText, queryByText } = renderToolbox([]);
      expect(
        await findByText(/^The toolbox contains/, {}, waitOptions),
      ).toBeInTheDocument();
      expect(queryByText('Lookup')).not.toBeInTheDocument();
    },
    testTimeout,
  );
});
