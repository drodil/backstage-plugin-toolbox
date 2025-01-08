import React from 'react';
import { Header, Page } from '@backstage/core-components';
import { ToolsContainer, ToolsContainerProps } from './ToolsContainer';
import { useToolboxTranslation } from '../../hooks';

export const ToolsPage = (props: ToolsContainerProps) => {
  const { t } = useToolboxTranslation();

  return (
    <Page themeId="tool">
      <Header title={t('toolsPage.title')} />
      <ToolsContainer {...props} />
    </Page>
  );
};
