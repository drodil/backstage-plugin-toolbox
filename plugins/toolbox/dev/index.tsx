import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { ToolboxPage, toolboxPlugin } from '../src/plugin';

createDevApp()
  .registerPlugin(toolboxPlugin)
  .addPage({
    element: <ToolboxPage />,
    title: 'Root Page',
    path: '/toolbox',
  })
  .render();
