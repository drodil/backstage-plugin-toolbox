import { Button, Tooltip } from '@material-ui/core';
import FileCopy from '@material-ui/icons/FileCopy';
import React from 'react';

type Props = {
  output: string | number;
  title?: string;
};

export const CopyToClipboardButton = (props: Props) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.output.toString());
    // TODO: handle success and error
  };

  return (
    <Tooltip arrow title={props.title ?? 'Copy output to clipboard'}>
      <Button size="small" startIcon={<FileCopy />} onClick={copyToClipboard}>
        Copy
      </Button>
    </Tooltip>
  );
};
