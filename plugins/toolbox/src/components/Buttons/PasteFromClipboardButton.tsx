import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';

type Props = {
  setInput: (input: string) => void;
  title?: string;
};

export const PasteFromClipboardButton = (props: Props) => {
  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(
      text => props.setInput(text),
      // TODO: handle error
    );
  };
  return (
    <Tooltip arrow title={props.title ?? 'Paste input from clipboard'}>
      <Button
        size="small"
        startIcon={<AssignmentReturnedIcon />}
        onClick={pasteFromClipboard}
        variant="text"
        color="inherit"
      >
        Clipboard
      </Button>
    </Tooltip>
  );
};
