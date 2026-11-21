import { ToolsContainerProps } from './ToolsContainer';
import { useParams } from 'react-router-dom';
import { useToolboxTranslation } from '../../hooks';
import { ToolContainer } from './ToolContainer';
import { getAllTools, getToolTitle } from '../../utils/tools';

export const ToolPage = (props: ToolsContainerProps) => {
  const { extraTools, tools } = props;
  const params = useParams();
  const { t } = useToolboxTranslation();

  // The list's tool set, before its favorites and visibility filters.
  const tool = getAllTools({ tools, extraTools }).find(
    ({ id }) => id === params.id,
  );
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
