import React, { Suspense } from 'react';
import { ToolsPageProps } from './ToolsPage';
import { defaultTools } from './tools';
import { useParams } from 'react-router-dom';
import { ContentHeader } from '@backstage/core-components';
import { Box, CircularProgress } from '@material-ui/core';

export const ToolPage = (props: ToolsPageProps) => {
  require('./ToolPage.css');
  const { extraTools } = props;
  const params = useParams();
  const allTools = [...(extraTools ?? []), ...defaultTools];
  const tool = allTools.find(({ id }) => id === params.id);
  if (!tool) {
    return <>Tool not available</>;
  }
  return (
    <div id="toolContainer">
      <Suspense
        fallback={
          <Box
            display="flex"
            width="100%"
            height="50%"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        }
      >
        <ContentHeader
          title={`${tool.category} - ${tool.name}`}
          description={tool.description}
        >
          {tool.headerButtons}
        </ContentHeader>
        {tool.component}
      </Suspense>
    </div>
  );
};
