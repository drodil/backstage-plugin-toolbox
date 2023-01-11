import { useStyles } from '../../utils/hooks';
import React from 'react';
import { DateTime } from 'luxon';
import { ContentHeader } from '@backstage/core-components';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { PasteFromClipboardButton } from '../Buttons/PasteFromClipboardButton';
import { ClearValueButton } from '../Buttons/ClearValueButton';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';

export const TimeConverter = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState<DateTime | null>(null);
  const [inputType, setInputType] = React.useState('unix');

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
      <ContentHeader title="Time converter" />
      <FormControl className={styles.fullWidth}>
        <Grid container>
          <Grid item xs={12} lg={8}>
            <Typography variant="subtitle1">
              Input
              <PasteFromClipboardButton setInput={v => handleChange(v)} />
              <ClearValueButton setValue={() => handleChange('')} />
              <Button size="small" onClick={() => setInput(DateTime.now())}>
                Now
              </Button>
            </Typography>
            <TextField
              className={styles.fullWidth}
              id="input"
              name="input"
              value={getInputStr()}
              onChange={e => handleChange(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Typography variant="subtitle1">Input type</Typography>
            <Select
              value={inputType}
              onChange={e => setInputType(e.target.value as string)}
            >
              <MenuItem value="unix">Unix time (seconds since epoch)</MenuItem>
              <MenuItem value="milliseconds">
                Milliseconds (since epoch)
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
              label="Local (ISO8601)"
              value={input?.toLocal().toString()}
            />
            <OutputField
              label="UTC (ISO8601)"
              value={input?.toUTC().toString()}
            />
            <OutputField label="Relative" value={input?.toRelative()} />
            <OutputField
              label="Unix time"
              value={input?.toSeconds().toFixed(0).toString()}
            />
            <OutputField label="RFC2822" value={input?.toRFC2822()} />
            <OutputField label="HTTP" value={input?.toHTTP()} />
          </Grid>
          <Grid item lg={2} md={4} xs={12}>
            <OutputField label="Day of the week" value={input?.toFormat('c')} />
            <OutputField label="Week number" value={input?.toFormat('W')} />
            <OutputField label="Quarter" value={input?.toFormat('q')} />
            <OutputField label="Day of the year" value={input?.toFormat('o')} />
            <OutputField
              label="Leap year"
              value={input?.isInLeapYear ? 'true' : 'false'}
            />
          </Grid>
          <Grid item lg={5} md={12} xs={12}>
            <OutputField
              label="Local"
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
            <OutputField label="Timezone" value={input?.toFormat('z')} />
          </Grid>
        </Grid>
      </FormControl>
    </>
  );
};
