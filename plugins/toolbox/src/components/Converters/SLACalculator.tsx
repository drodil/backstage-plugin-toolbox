import { useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import {
  Divider,
  FormControl,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  textField: {
    marginBottom: theme.spacing(2), // 1rem = 16px
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
}));

export const SLACalculator = () => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState({
    daily: '',
    weekly: '',
    monthly: '',
    quarterly: '',
    yearly: '',
  });
  const [error, setError] = useState({
    show: false,
    msg: '',
  });
  const { t } = useToolboxTranslation();

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
      setError({ show: true, msg: t('tool.sla-calculator.invalidFormat') });
      return;
    }
    setInput(value);
    setError({ show: false, msg: '' });

    let base = parseFloat(value);
    if (base > 100) {
      setError({ show: true, msg: t('tool.sla-calculator.maxValueError') });
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
      <div className={classes.textField}>
        <TextField
          label={label}
          variant="outlined"
          disabled
          value={value ?? ''}
          style={{ width: '100%' }}
          autoComplete="off"
        />
        <CopyToClipboardButton output={value ?? ''} />
      </div>
    );
  };

  return (
    <FormControl className={classes.formControl}>
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
            <SampleButton setInput={handleChange} sample="99.9" />
          </Typography>
          <TextField
            style={{ width: '100%', marginTop: '1rem' }}
            id="input"
            label={t('tool.sla-calculator.inputLabel')}
            name="input"
            value={input}
            onChange={e => handleChange(e.target.value)}
            variant="outlined"
            autoComplete="off"
          />
          {error.show ? <Alert severity="error">{error.msg}</Alert> : null}
        </Grid>
      </Grid>
      <Divider style={{ marginTop: '1rem', marginBottom: '1rem' }} />
      <Grid container>
        <Grid item lg={5} md={8} xs={12}>
          <OutputField
            label={t('tool.sla-calculator.dailyLabel')}
            value={output.daily}
          />
          <OutputField
            label={t('tool.sla-calculator.weeklyLabel')}
            value={output.weekly}
          />
          <OutputField
            label={t('tool.sla-calculator.monthlyLabel')}
            value={output.monthly}
          />
          <OutputField
            label={t('tool.sla-calculator.quarterlyLabel')}
            value={output.quarterly}
          />
          <OutputField
            label={t('tool.sla-calculator.yearlyLabel')}
            value={output.yearly}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default SLACalculator;

// Only float values are supported!
