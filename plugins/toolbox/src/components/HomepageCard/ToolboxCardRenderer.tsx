import { InfoCard } from '@backstage/core-components';
import { Content } from './Content';
import { defaultTools } from '../Root';
import { useToolboxTranslation } from '../../hooks';
import { getToolTitle } from '../../utils/tools';

export const ToolboxCardRenderer = ({ toolId }: { toolId?: string }) => {
  const { t } = useToolboxTranslation();
  const tool = defaultTools.find(tl => tl.id === toolId);

  let title = t('toolsPage.title');
  if (tool) {
    title = getToolTitle(tool, t);
  }

  return (
    <InfoCard title={title}>
      <Content toolId={toolId} />
    </InfoCard>
  );
};
