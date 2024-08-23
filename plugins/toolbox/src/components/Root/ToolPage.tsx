import React, { Suspense } from 'react';
import { ToolsPageProps } from './ToolsPage';
import { defaultTools } from './tools';
import { useParams } from 'react-router-dom';
import { ContentHeader } from '@backstage/core-components';
import { useStyles } from '../../utils/hooks';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useToolboxTranslation } from '../../hooks';

export const ToolPage = (props: ToolsPageProps) => {
  const { extraTools } = props;
  const params = useParams();
  const { classes } = useStyles();
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
    <div id="toolContainer" className={classes.toolContainer}>
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
    </div>
  );
};
