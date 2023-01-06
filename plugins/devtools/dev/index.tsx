import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { devtoolsPlugin, DevtoolsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(devtoolsPlugin)
  .addPage({
    element: <DevtoolsPage />,
    title: 'Root Page',
    path: '/devtools',
  })
  .render();
