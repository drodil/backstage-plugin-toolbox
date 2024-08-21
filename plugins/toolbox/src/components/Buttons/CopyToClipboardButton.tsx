import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import FileCopy from '@mui/icons-material/FileCopy';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  output: string | number;
  title?: string;
};

export const CopyToClipboardButton = (props: Props) => {
  const { t } = useToolboxTranslation();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.output.toString());
    // TODO: handle success and error
  };

  return (
    <Tooltip arrow title={props.title ??  t('components.copyToClipboardButton.tooltipTitle')}>
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
