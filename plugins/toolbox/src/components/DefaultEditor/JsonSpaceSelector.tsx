import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
      variant="standard"
      MenuProps={{
        MenuListProps: {
          sx: {
            'li.MuiButtonBase-root': {
              display: 'flex',
              flexDirection: 'column',
            },
          },
        },
      }}
    >
      <MenuItem value={2} sx={{ p: '6px 16px !important' }}>
        2 spaces
      </MenuItem>
      <MenuItem value={3} sx={{ p: '6px 16px !important' }}>
        3 spaces
      </MenuItem>
      <MenuItem value={4} sx={{ p: '6px 16px !important' }}>
        4 spaces
      </MenuItem>
      <MenuItem value={8} sx={{ p: '6px 16px !important' }}>
        8 spaces
      </MenuItem>
    </Select>
  );
};
