import { ToolsContainerProps } from './ToolsContainer';
import { defaultTools } from './tools';
import { useParams } from 'react-router-dom';
import { useToolboxTranslation } from '../../hooks';
import { ToolContainer } from './ToolContainer';
import { getToolTitle } from '../../utils/tools';

export const ToolPage = (props: ToolsContainerProps) => {
  const { extraTools } = props;
  const params = useParams();
  const { t } = useToolboxTranslation();

  const allTools = [...(extraTools ?? []), ...defaultTools];
  const tool = allTools.find(({ id }) => id === params.id);
  if (!tool) {
    return <>{t('toolPage.toolNotAvailable')}</>;
  }

  const title = getToolTitle(tool, t);
  const description = t(`tool.${tool.id}.description`, {
    defaultValue: tool.description,
  });

  return (
    <ToolContainer
      tool={{
        ...tool,
        name: title,
        description,
      }}
    />
  );
};
