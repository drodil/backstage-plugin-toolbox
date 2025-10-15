import { Suspense } from 'react';
import { ContentHeader } from '@backstage/core-components';
import { Box, CircularProgress } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import type { Tool } from '@drodil/backstage-plugin-toolbox-react';

const StyledToolContainer = styled('div')(({ theme }) => ({
  padding: '1rem',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: theme.palette.background.default,
}));

export interface ToolContainerProps {
  tool: Tool;
}

export const ToolContainer = (props: ToolContainerProps) => {
  const { tool } = props;

  return (
    <StyledToolContainer>
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
          title={tool.displayName ?? tool.name}
          description={tool.description}
        >
          {tool.headerButtons}
        </ContentHeader>
        {tool.component}
      </Suspense>
    </StyledToolContainer>
  );
};
