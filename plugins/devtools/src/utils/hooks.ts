import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => {
  return {
    fullWidth: {
      width: '100%',
    },
    marginBottomSmall: {
      marginBottom: theme.spacing(1),
    },
  };
});
