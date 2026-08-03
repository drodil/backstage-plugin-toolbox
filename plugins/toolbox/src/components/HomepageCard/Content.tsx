import { defaultTools } from '../Root';
import { Text } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';

export const Content = (props?: { toolId?: string }) => {
  const { t: intl } = useToolboxTranslation();

  const tool = defaultTools.find(t => t.id === props?.toolId);
  if (!tool) {
    return (
      <Text variant="title-small">
        {intl('components.homePageCard.selectToolText')}
      </Text>
    );
  }
  return tool.component;
};
