import { Button, Tooltip } from '@material-ui/core';
import FileCopy from '@material-ui/icons/FileCopy';
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
    <Tooltip
      arrow
      title={props.title ?? t('components.copyToClipboardButton.tooltipTitle')}
    >
      <Button
        size="small"
        startIcon={<FileCopy />}
        onClick={copyToClipboard}
        variant="text"
        color="inherit"
      >
        {t('components.copyToClipboardButton.buttonText')}
      </Button>
    </Tooltip>
  );
};
