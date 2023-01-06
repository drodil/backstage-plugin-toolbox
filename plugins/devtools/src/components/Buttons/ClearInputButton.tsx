import { Button } from '@material-ui/core';
import React from 'react';
import Clear from '@material-ui/icons/Clear';

type Props = {
  setInput: (input: string) => void;
};

export const ClearInputButton = (props: Props) => {
  return (
    <Button startIcon={<Clear />} onClick={() => props.setInput('')}>
      Clear
    </Button>
  );
};
