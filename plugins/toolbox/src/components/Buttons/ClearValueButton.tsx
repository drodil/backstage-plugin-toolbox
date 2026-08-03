import { TooltipTrigger, Tooltip, Button } from '@backstage/ui';
import { RiCloseLine } from '@remixicon/react';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  setValue: (input: string) => void;
  tooltip?: string;
};

export const ClearValueButton = (props: Props) => {
  const { t } = useToolboxTranslation();
  return (
    <TooltipTrigger>
      <Button variant="tertiary" onClick={() => props.setValue('')}>
        <RiCloseLine size={16} />
        {t('components.clearValueButton.buttonText')}
      </Button>
      <Tooltip>
        {props.tooltip ?? t('components.clearValueButton.tooltipTitle')}
      </Tooltip>
    </TooltipTrigger>
  );
};
