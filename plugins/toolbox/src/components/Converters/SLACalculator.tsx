import { useStyles } from '../../utils/hooks';
import React from 'react';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { PasteFromClipboardButton } from '../Buttons/PasteFromClipboardButton';
import { ClearValueButton } from '../Buttons/ClearValueButton';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';
import Alert from '@material-ui/lab/Alert/Alert';

export const SLACalculator = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState({
    daily: '',
    weekly: '',
    monthly: '',
    quarterly: '',
    yearly: '',
  });
  const [error, setError] = React.useState({
    show: false,
    msg: '',
  });

  const convertTime = (value: number) => {
    let minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  };

  const isValidFloat = (value: string) => {
    return /^\d+(\.\d*)?$/.test(value);
  };

  const handleChange = (value: string) => {
    if (value.length === 0) {
      setInput('');
      setOutput({
        daily: '',
        weekly: '',
        monthly: '',
        quarterly: '',
        yearly: '',
      });
      return;
    }

    if (!isValidFloat(value)) {
      setError({ show: true, msg: 'Only float values are supported!' });
      return;
    }
    setInput(value);
    setError({ show: false, msg: '' });

    let base = parseFloat(value);
    if (base > 100) {
      setError({ show: true, msg: 'Max value is 100!' });
      base = 100;
      setInput('100');
    }

    const daily = (24 - (base * 24) / 100) * 60 * 60;

    setOutput({
      daily: convertTime(daily),
      weekly: convertTime(daily * 7),
      monthly: convertTime(daily * 30),
      quarterly: convertTime(daily * 91),
      yearly: convertTime(daily * 365),
    });
  };

  const OutputField = (props: { label: string; value?: string | null }) => {
    const { label, value } = props;
    return (
      <>
        <TextField
          label={label}
          style={{ marginTop: '1rem' }}
          className={styles.fullWidth}
          disabled
          value={value ?? ''}
        />
        <CopyToClipboardButton output={value ?? ''} />
      </>
    );
  };

  return (
    <>
      <FormControl className={styles.fullWidth}>
        <Grid container>
          <Grid item xs={12} lg={8}>
            <Typography variant="subtitle1">
              <PasteFromClipboardButton setInput={v => handleChange(v)} />
              <ClearValueButton
                setValue={() => {
                  handleChange('');
                  setError({ show: false, msg: '' });
                }}
              />
              <Button size="small" onClick={() => handleChange('99.9')}>
                Sample
              </Button>
            </Typography>
            <TextField
              className={styles.fullWidth}
              id="input"
              label="Agreed SLA level in %"
              name="input"
              value={input}
              onChange={e => handleChange(e.target.value)}
              variant="outlined"
            />
            {error.show ? <Alert severity="error">{error.msg}</Alert> : null}
          </Grid>
        </Grid>
        <Divider style={{ marginTop: '1rem', marginBottom: '1rem' }} />
        <Grid container>
          <Grid item lg={5} md={8} xs={12}>
            <OutputField label="Daily" value={output.daily} />
            <OutputField label="Weekly" value={output.weekly} />
            <OutputField label="Monthly" value={output.monthly} />
            <OutputField label="Quarterly" value={output.quarterly} />
            <OutputField label="Yearly" value={output.yearly} />
          </Grid>
        </Grid>
      </FormControl>
    </>
  );
};

export default SLACalculator;

// Only float values are supported!
