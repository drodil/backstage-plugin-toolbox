import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const TimePaper = (props: { value: number; title: string }) => {
  const formattedValue = props.value.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return (
    <Paper style={{ padding: '1rem', textAlign: 'center' }}>
      <Typography variant="caption">{props.title}</Typography>
      <Typography variant="h1">{formattedValue}</Typography>
    </Paper>
  );
};
