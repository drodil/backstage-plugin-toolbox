import { useState } from 'react';
import { DateTime } from 'luxon';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
} from '../Buttons';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useToolboxTranslation } from '../../hooks';

export const TimeConverter = () => {
  const [input, setInput] = useState<DateTime | null>(null);
  const [inputType, setInputType] = useState('unix');
  const { t } = useToolboxTranslation();

  const getInputStr = () => {
    if (input === null) {
      return '';
    }

    switch (inputType) {
      default:
      case 'unix':
        return input?.toSeconds().toFixed(0).toString();
      case 'iso8601':
        return input.toISO();
      case 'milliseconds':
        return input.toMillis().toString(10);
      case 'rfc2822':
        return input.toRFC2822();
      case 'http':
        return input.toHTTP();
      case 'sql':
        return input.toSQL();
    }
  };

  const handleChange = (value: string) => {
    if (value.length === 0) {
      setInput(null);
      return;
    }

    switch (inputType) {
      default:
      case 'unix':
        setInput(DateTime.fromSeconds(Number.parseInt(value, 10)));
        break;
      case 'iso8601':
        setInput(DateTime.fromISO(value));
        break;
      case 'milliseconds':
        setInput(DateTime.fromMillis(Number.parseInt(value, 10)));
        break;
      case 'rfc2822':
        setInput(DateTime.fromRFC2822(value));
        break;
      case 'http':
        setInput(DateTime.fromHTTP(value));
        break;
      case 'sql':
        setInput(DateTime.fromSQL(value));
        break;
    }
  };

  const OutputField = (props: { label: string; value?: string | null }) => {
    const { label, value } = props;
    return (
      <>
        <TextField
          label={label}
          style={{ marginTop: '1rem', width: '100%' }}
          disabled
          value={value ?? ''}
        />
        <CopyToClipboardButton output={value ?? ''} />
      </>
    );
  };

  return (
    <FormControl style={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={12} lg={8}>
          <Typography variant="subtitle1">
            <PasteFromClipboardButton setInput={v => handleChange(v)} />
            <ClearValueButton setValue={() => handleChange('')} />
            <Button
              size="small"
              onClick={() => setInput(DateTime.now())}
              color="inherit"
            >
              {t('tool.time-convert.labelNow')}
            </Button>
          </Typography>
          <TextField
            style={{ width: '100%' }}
            id="input"
            name="input"
            label={t('tool.time-convert.labelInput')}
            value={getInputStr()}
            onChange={e => handleChange(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Typography variant="subtitle1">
            {t('tool.time-convert.inputType')}
          </Typography>
          <Select
            value={inputType}
            onChange={e => setInputType(e.target.value as string)}
          >
            <MenuItem value="unix">{t('tool.time-convert.unixTime')}</MenuItem>
            <MenuItem value="milliseconds">
              {t('tool.time-convert.millisecondsTime')}
            </MenuItem>
            <MenuItem value="iso8601">ISO8601</MenuItem>
            <MenuItem value="sql">SQL</MenuItem>
            <MenuItem value="rfc2822">RFC2822</MenuItem>
            <MenuItem value="http">HTTP</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: '1rem', marginBottom: '1rem' }} />
      <Grid container>
        <Grid item lg={5} md={8} xs={12}>
          <OutputField
            label={`${t('tool.time-convert.outputLabel.local')} (ISO8601)`}
            value={input?.toLocal().toString()}
          />
          <OutputField
            label="UTC (ISO8601)"
            value={input?.toUTC().toString()}
          />
          <OutputField label="Relative" value={input?.toRelative()} />
          <OutputField
            label={t('tool.time-convert.outputLabel.unix')}
            value={input?.toSeconds().toFixed(0).toString()}
          />
          <OutputField label="RFC2822" value={input?.toRFC2822()} />
          <OutputField label="HTTP" value={input?.toHTTP()} />
        </Grid>
        <Grid item lg={2} md={4} xs={12}>
          <OutputField
            label={t('tool.time-convert.outputLabel.dayOfTheWeek')}
            value={input?.toFormat('c')}
          />
          <OutputField
            label={t('tool.time-convert.outputLabel.weekNumber')}
            value={input?.toFormat('W')}
          />
          <OutputField
            label={t('tool.time-convert.outputLabel.quarter')}
            value={input?.toFormat('q')}
          />
          <OutputField
            label={t('tool.time-convert.outputLabel.dayOfTheYear')}
            value={input?.toFormat('o')}
          />
          <OutputField
            label={t('tool.time-convert.outputLabel.leapYear')}
            value={input?.isInLeapYear ? 'true' : 'false'}
          />
        </Grid>
        <Grid item lg={5} md={12} xs={12}>
          <OutputField
            label={t('tool.time-convert.outputLabel.local')}
            value={input?.toLocaleString(DateTime.DATETIME_FULL)}
          />
          <OutputField label="SQL" value={input?.toSQL()} />
          <OutputField
            label="YYYY-MM-DD"
            value={input?.toFormat('yyyy-MM-dd')}
          />
          <OutputField
            label="DD/MM/YYYY"
            value={input?.toFormat('dd/MM/yyyy')}
          />
          <OutputField
            label={t('tool.time-convert.outputLabel.timezone')}
            value={input?.toFormat('z')}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default TimeConverter;
