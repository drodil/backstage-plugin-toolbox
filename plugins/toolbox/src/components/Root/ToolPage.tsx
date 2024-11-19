import React, { Suspense } from 'react';
import { ToolsPageProps } from './ToolsPage';
import { defaultTools } from './tools';
import { useParams } from 'react-router-dom';
import { ContentHeader } from '@backstage/core-components';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useToolboxTranslation } from '../../hooks';
import { styled } from '@mui/material/styles';

const ToolContainer = styled('div')(({ theme }) => ({
  padding: '1rem',
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  zIndex: 10000,
  backgroundColor: theme.palette.background.default,
}));

export const ToolPage = (props: ToolsPageProps) => {
  const { extraTools } = props;
  const params = useParams();
  const { t } = useToolboxTranslation();

  const allTools = [...(extraTools ?? []), ...defaultTools];
  const tool = allTools.find(({ id }) => id === params.id);
  if (!tool) {
    return <>{t('toolPage.toolNotAvailable')}</>;
  }

  const title = `${t(
    `tool.category.${(tool.category ?? 'miscellaneous').toLowerCase()}`,
    {
      defaultValue: tool.category ?? 'Miscellaneous',
    },
  )} - ${t(`tool.${tool.id}.name`, {
    defaultValue: tool.name,
  })}`;
  const description = t(`tool.${tool.id}.description`, {
    defaultValue: tool.description,
  });

  return (
    <ToolContainer>
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
        <ContentHeader title={title} description={description}>
          {tool.headerButtons}
        </ContentHeader>
        {tool.component}
      </Suspense>
    </ToolContainer>
  );
};
