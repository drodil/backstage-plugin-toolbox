import { TextField } from '@material-ui/core';
import { CopyToClipboardButton } from '../Buttons';
import React from 'react';
import { useStyles } from '../../utils/hooks';

export const OutputField = (props: {
  label: string;
  value?: string | null;
}) => {
  const styles = useStyles();
  const { label, value } = props;
  return (
    <>
      <TextField
        label={label}
        className={styles.fullWidth}
        disabled
        value={value ?? ''}
      />
      <CopyToClipboardButton output={value ?? ''} />
    </>
  );
};
