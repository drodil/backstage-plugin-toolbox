import { Button, Tooltip } from '@material-ui/core';
import React from 'react';
import Clear from '@material-ui/icons/Clear';

type Props = {
  setInput: (input: string) => void;
};

export const ClearInputButton = (props: Props) => {
  return (
    <Tooltip arrow title="Clear input value">
      <Button startIcon={<Clear />} onClick={() => props.setInput('')}>
        Clear
      </Button>
    </Tooltip>
  );
};
