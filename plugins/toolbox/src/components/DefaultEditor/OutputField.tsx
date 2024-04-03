import { CopyToClipboardButton } from '../Buttons';
import React from 'react';
import { useStyles } from '../../utils/hooks';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export const OutputField = (props: {
  label: string;
  value?: string | null;
}) => {
  const { classes } = useStyles();
  const { label, value } = props;
  return (
    <Box sx={{ pt: '1rem' }}>
      <TextField
        label={label}
        className={classes.fullWidth}
        disabled
        value={value ?? ''}
      />
      <CopyToClipboardButton output={value ?? ''} />
    </Box>
  );
};
