import { CustomHomepageGrid } from '@backstage/plugin-home';
import {
  toolboxHomepageCardFactory,
  useToolboxTranslation,
} from '@drodil/backstage-plugin-toolbox';
import { Content, Page } from '@backstage/core-components';

export const HomePageWithFactory = () => {
  const { t } = useToolboxTranslation();
  const CustomToolboxHomepageCard = toolboxHomepageCardFactory({ t });
  return (
    <Page themeId="home">
      <Content>
        <CustomHomepageGrid>
          <CustomToolboxHomepageCard />
        </CustomHomepageGrid>
      </Content>
    </Page>
  );
};
