import { Button, Tooltip } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  setValue: (input: string) => void;
  tooltip?: string;
};

export const ClearValueButton = (props: Props) => {
  const { t } = useToolboxTranslation();
  return (
    <Tooltip
      arrow
      title={props.tooltip ?? t('components.clearValueButton.tooltipTitle')}
    >
      <Button
        size="small"
        startIcon={<Clear />}
        onClick={() => props.setValue('')}
        variant="text"
        color="inherit"
      >
        {t('components.clearValueButton.buttonText')}
      </Button>
    </Tooltip>
  );
};
