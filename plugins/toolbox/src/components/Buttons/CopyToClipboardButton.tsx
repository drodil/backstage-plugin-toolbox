import { TooltipTrigger, Tooltip, Button } from '@backstage/ui';
import { RiFileCopyLine } from '@remixicon/react';
import { useToolboxTranslation } from '../../hooks';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

type Props = {
  output: string | number;
  title?: string;
};

export const CopyToClipboardButton = (props: Props) => {
  const { t } = useToolboxTranslation();
  const alertApi = useApi(alertApiRef);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(props.output.toString())
      .then(() => {
        alertApi.post({ message: 'Copied to clipboard!', severity: 'success' });
      })
      .catch(() => {
        alertApi.post({
          message: 'Failed to copy to clipboard!',
          severity: 'error',
        });
      });
  };

  return (
    <TooltipTrigger>
      <Button variant="tertiary" onClick={copyToClipboard}>
        <RiFileCopyLine size={16} />
        {t('components.copyToClipboardButton.buttonText')}
      </Button>
      <Tooltip>
        {props.title ?? t('components.copyToClipboardButton.tooltipTitle')}
      </Tooltip>
    </TooltipTrigger>
  );
};
