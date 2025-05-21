import { defaultTools } from '../Root';
import Typography from '@mui/material/Typography';
import { useToolboxTranslation } from '../../hooks';

export const Content = (props?: { toolId?: string }) => {
  const { t: intl } = useToolboxTranslation();

  const tool = defaultTools.find(t => t.id === props?.toolId);
  if (!tool) {
    return (
      <Typography variant="h4">
        {intl('components.homePageCard.selectToolText')}
      </Typography>
    );
  }
  return tool.component;
};
