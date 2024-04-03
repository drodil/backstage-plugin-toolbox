import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Clear from '@mui/icons-material/Clear';

type Props = {
  setValue: (input: string) => void;
  tooltip?: string;
};

export const ClearValueButton = (props: Props) => {
  return (
    <Tooltip arrow title={props.tooltip ? props.tooltip : 'Clear input value'}>
      <Button
        size="small"
        startIcon={<Clear />}
        onClick={() => props.setValue('')}
        variant="text"
        color="inherit"
      >
        Clear
      </Button>
    </Tooltip>
  );
};
