import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Input from '@mui/icons-material/Input';

type Props = {
  sample: string;
  setInput: (input: string) => void;
};

export const SampleButton = (props: Props) => {
  return (
    <Tooltip arrow title="Input sample">
      <Button
        size="small"
        startIcon={<Input />}
        onClick={() => props.setInput(props.sample)}
        variant="text"
        color="inherit"
      >
        Sample
      </Button>
    </Tooltip>
  );
};
