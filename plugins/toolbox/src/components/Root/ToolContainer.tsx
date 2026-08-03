import { Suspense } from 'react';
import { ContentHeader } from '@backstage/core-components';
import { Flex } from '@backstage/ui';
import type { Tool } from '@drodil/backstage-plugin-toolbox-react';

export interface ToolContainerProps {
  tool: Tool;
}

export const ToolContainer = (props: ToolContainerProps) => {
  const { tool } = props;

  return (
    <div
      style={{
        padding: '1rem',
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Suspense
        fallback={
          <Flex
            align="center"
            justify="center"
            style={{ width: '100%', height: '50%' }}
          >
            <span>Loading...</span>
          </Flex>
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
    </div>
  );
};
