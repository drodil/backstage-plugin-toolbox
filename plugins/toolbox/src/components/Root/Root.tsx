import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToolsPage, ToolsPageProps } from './ToolsPage';
import { ToolPage } from './ToolPage';

export const Root = (props: ToolsPageProps) => {
  return (
    <Routes>
      <Route path="/" element={<ToolsPage {...props} />} />
      <Route path="/tool/:id" element={<ToolPage {...props} />} />
    </Routes>
  );
};
