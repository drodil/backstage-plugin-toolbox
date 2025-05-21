import { Route, Routes } from 'react-router-dom';
import { ToolsPage } from './ToolsPage';
import { ToolPage } from './ToolPage';
import type { ToolsContainerProps } from './ToolsContainer';

export const Root = (props: ToolsContainerProps) => {
  return (
    <Routes>
      <Route path="/" element={<ToolsPage {...props} />} />
      <Route path="/tool/:id" element={<ToolPage {...props} />} />
    </Routes>
  );
};
