import { TooltipTrigger, Tooltip, Button } from '@backstage/ui';
import { RiFileDownloadLine } from '@remixicon/react';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  sample: string;
  setInput: (input: string) => void;
};

export const SampleButton = (props: Props) => {
  const { t } = useToolboxTranslation();
  return (
    <TooltipTrigger>
      <Button variant="tertiary" onClick={() => props.setInput(props.sample)}>
        <RiFileDownloadLine size={16} />
        {t('components.sampleButton.buttonText')}
      </Button>
      <Tooltip>{t('components.sampleButton.tooltipTitle')}</Tooltip>
    </TooltipTrigger>
  );
};
