import { makeStyles, Paper, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme => ({
  paper: {
    padding: theme.spacing(2), // 1rem = 16px
    textAlign: 'center',
  },
}));

export const TimePaper = (props: { title: string; value: number }) => {
  const classes = useStyles();
  const formattedValue = props.value.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return (
    <Paper className={classes.paper}>
      <Typography variant="caption">{props.title}</Typography>
      <Typography variant="h1">{formattedValue}</Typography>
    </Paper>
  );
};
