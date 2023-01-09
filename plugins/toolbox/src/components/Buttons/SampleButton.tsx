import { Button, Tooltip } from '@material-ui/core';
import React from 'react';
import Input from '@material-ui/icons/Input';

type Props = {
  sample: string;
  setInput: (input: string) => void;
};

export const SampleButton = (props: Props) => {
  return (
    <Tooltip arrow title="Input sample">
      <Button
        startIcon={<Input />}
        onClick={() => props.setInput(props.sample)}
      >
        Sample
      </Button>
    </Tooltip>
  );
};
