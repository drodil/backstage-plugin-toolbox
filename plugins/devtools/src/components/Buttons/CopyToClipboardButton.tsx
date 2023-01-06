import { Button } from '@material-ui/core';
import FileCopy from '@material-ui/icons/FileCopy';
import React from 'react';

type Props = {
  output: string;
};

export const CopyToClipboardButton = (props: Props) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.output);
    // TODO: handle success and error
  };

  return (
    <Button startIcon={<FileCopy />} onClick={copyToClipboard}>
      Copy
    </Button>
  );
};
