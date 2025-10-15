import { CopyToClipboardButton } from '../Buttons';
import { Box, makeStyles, TextField, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme => ({
  container: {
    paddingBottom: theme.spacing(2), // 1rem = 16px
  },
  textField: {
    width: '100%',
  },
}));

export const OutputField = (props: {
  label: string;
  value?: string | null;
}) => {
  const { label, value } = props;
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <TextField
        label={label}
        variant="outlined"
        className={classes.textField}
        disabled
        value={value ?? ''}
      />
      <CopyToClipboardButton output={value ?? ''} />
    </Box>
  );
};
