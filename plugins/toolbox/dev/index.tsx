import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { ToolboxPage, toolboxPlugin } from '../src/plugin';

const extraToolExample = { name: 'Extra', component: <div>Extra tool</div> };

createDevApp()
  .registerPlugin(toolboxPlugin)
  .addPage({
    element: <ToolboxPage extraTools={[extraToolExample]} />,
    title: 'Root Page',
    path: '/toolbox',
  })
  .render();
