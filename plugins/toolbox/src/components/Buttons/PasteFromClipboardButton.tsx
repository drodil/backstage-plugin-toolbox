import { Button } from '@material-ui/core';
import React from 'react';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';

type Props = {
  setInput: (input: string) => void;
};

export const PasteFromClipboardButton = (props: Props) => {
  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(
      text => props.setInput(text),
      // TODO: handle error
    );
  };
  return (
    <Button startIcon={<AssignmentReturnedIcon />} onClick={pasteFromClipboard}>
      Clipboard
    </Button>
  );
};
