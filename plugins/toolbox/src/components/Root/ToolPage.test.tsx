import { renderInTestApp } from '@backstage/test-utils';
import { Route, Routes } from 'react-router-dom';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { ToolPage } from './ToolPage';
import { ToolsContainerProps } from './ToolsContainer';

const customTool: Tool = {
  id: 'custom-tool',
  name: 'Custom tool',
  component: <div>Custom tool content</div>,
};

const renderToolPage = (toolId: string, props: ToolsContainerProps) =>
  renderInTestApp(
    <Routes>
      <Route path="/tool/:id" element={<ToolPage {...props} />} />
    </Routes>,
    { routeEntries: [`/tool/${toolId}`] },
  );

describe('ToolPage', () => {
  it('renders a tool passed in tools', async () => {
    const { findByText } = await renderToolPage('custom-tool', {
      tools: [customTool],
    });
    expect(await findByText('Custom tool content')).toBeInTheDocument();
  });

  it('renders a tool passed in extraTools when tools is not set', async () => {
    const { findByText } = await renderToolPage('custom-tool', {
      extraTools: [customTool],
    });
    expect(await findByText('Custom tool content')).toBeInTheDocument();
  });

  it('does not render a default tool that is missing from tools', async () => {
    const { findByText } = await renderToolPage('base64-encode', {
      tools: [customTool],
    });
    expect(await findByText('Tool not available')).toBeInTheDocument();
  });

  it('shows a message for an unknown tool id', async () => {
    const { findByText } = await renderToolPage('does-not-exist', {
      tools: [customTool],
    });
    expect(await findByText('Tool not available')).toBeInTheDocument();
  });
});
