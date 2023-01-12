import { MenuItem, Select } from '@material-ui/core';
import React from 'react';

export const JsonSpaceSelector = (props: {
  spaces: number;
  onChange: (spaces: number) => void;
}) => {
  return (
    <Select
      value={props.spaces}
      onChange={e =>
        props.onChange(Number.parseInt(e.target.value as string, 10))
      }
    >
      <MenuItem value={2}>2 spaces</MenuItem>
      <MenuItem value={3}>3 spaces</MenuItem>
      <MenuItem value={4}>4 spaces</MenuItem>
      <MenuItem value={8}>8 spaces</MenuItem>
    </Select>
  );
};
