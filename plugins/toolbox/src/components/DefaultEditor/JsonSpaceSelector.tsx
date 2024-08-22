import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import { useToolboxTranslation } from '../../hooks';

export const JsonSpaceSelector = (props: {
  spaces: number;
  onChange: (spaces: number) => void;
}) => {
  const { t } = useToolboxTranslation();
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
        {t('components.jsonSpaceSelector.space', { count: 2 })}
      </MenuItem>
      <MenuItem value={3} sx={{ p: '6px 16px !important' }}>
        {t('components.jsonSpaceSelector.space', { count: 3 })}
      </MenuItem>
      <MenuItem value={4} sx={{ p: '6px 16px !important' }}>
        {t('components.jsonSpaceSelector.space', { count: 4 })}
      </MenuItem>
      <MenuItem value={8} sx={{ p: '6px 16px !important' }}>
        {t('components.jsonSpaceSelector.space', { count: 8 })}
      </MenuItem>
    </Select>
  );
};
