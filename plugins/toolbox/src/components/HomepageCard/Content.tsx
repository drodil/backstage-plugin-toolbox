import React from 'react';
import { defaultTools } from '../Root/tools';
import { Typography } from '@material-ui/core';

export const Content = (props?: { toolId?: string }) => {
  const tool = defaultTools.find(t => t.id === props?.toolId);
  if (!tool) {
    return (
      <Typography variant="h4">Select tool from widget settings</Typography>
    );
  }
  return tool.component;
};
