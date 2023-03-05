import { useStyles } from '../../utils/hooks';
import React from 'react';
import {
  Divider,
  FormControl,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { PasteFromClipboardButton } from '../Buttons/PasteFromClipboardButton';
import { ClearValueButton } from '../Buttons/ClearValueButton';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';

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

    const base = parseFloat(value);
    if (isNaN(base)) {
      return;
    }
    if (base >= 100) {
      return;
    }

    setInput(value);

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
              Agreed SLA level in %
              <PasteFromClipboardButton setInput={v => handleChange(v)} />
              <ClearValueButton setValue={() => handleChange('')} />
            </Typography>
            <TextField
              className={styles.fullWidth}
              id="input"
              name="input"
              value={input}
              onChange={e => handleChange(e.target.value)}
              variant="outlined"
            />
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
