import { Button, Tooltip } from '@material-ui/core';
import React from 'react';
import Clear from '@material-ui/icons/Clear';

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
      >
        Clear
      </Button>
    </Tooltip>
  );
};
