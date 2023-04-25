import React from 'react';
import { CustomHomepageGrid } from '@backstage/plugin-home';
import { ToolboxHomepageCard } from '../src/plugin';
import { Content, Page } from '@backstage/core-components';

export const HomePage = () => {
  return (
    <Page themeId="home">
      <Content>
        <CustomHomepageGrid>
          <ToolboxHomepageCard />
        </CustomHomepageGrid>
      </Content>
    </Page>
  );
};
