import { useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
} from '../Buttons';
import {
  FormControl,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(() => ({
  formControl: {
    width: '100%',
  },
  textField: {
    width: '100%',
  },
}));

export const NumberBase = () => {
  const [state, setState] = useState({
    binary: '',
    octal: '',
    decimal: '',
    hex: '',
  });
  const { t } = useToolboxTranslation();
  const classes = useStyles();

  const handleChange = (name: string, value: string) => {
    if (value.length === 0) {
      setState({ binary: '', octal: '', decimal: '', hex: '' });
      return;
    }

    let base;
    switch (name) {
      case 'binary':
        base = parseInt(value, 2);
        break;
      case 'octal':
        base = parseInt(value, 8);
        break;
      case 'decimal':
        base = parseInt(value, 10);
        break;
      case 'hex':
        base = parseInt(value, 16);
        break;
      default:
        base = NaN;
    }

    if (isNaN(base)) {
      return;
    }

    setState({
      binary: base.toString(2),
      octal: base.toString(8),
      decimal: base.toString(10),
      hex: base.toString(16),
    });
  };

  return (
    <FormControl className={classes.formControl}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {t('tool.number-base-convert.base2')}
            <PasteFromClipboardButton
              setInput={v => handleChange('binary', v)}
            />
            <ClearValueButton setValue={() => handleChange('binary', '')} />
            <CopyToClipboardButton output={state.binary} />
          </Typography>
          <TextField
            style={{ width: '100%' }}
            id="binary"
            name="binary"
            value={state.binary}
            onChange={e => handleChange('binary', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {t('tool.number-base-convert.base8')}
            <PasteFromClipboardButton
              setInput={v => handleChange('octal', v)}
            />
            <ClearValueButton setValue={() => handleChange('octal', '')} />
            <CopyToClipboardButton output={state.octal} />
          </Typography>
          <TextField
            style={{ width: '100%' }}
            id="octal"
            name="octal"
            value={state.octal}
            onChange={e => handleChange('octal', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {t('tool.number-base-convert.base10')}
            <PasteFromClipboardButton
              setInput={v => handleChange('decimal', v)}
            />
            <ClearValueButton setValue={() => handleChange('decimal', '')} />
            <CopyToClipboardButton output={state.decimal} />
          </Typography>
          <TextField
            style={{ width: '100%' }}
            id="decimal"
            name="decimal"
            value={state.decimal}
            onChange={e => handleChange('decimal', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {t('tool.number-base-convert.base16')}
            <PasteFromClipboardButton setInput={v => handleChange('hex', v)} />
            <ClearValueButton setValue={() => handleChange('hex', '')} />
            <CopyToClipboardButton output={state.hex} />
          </Typography>
          <TextField
            style={{ width: '100%' }}
            id="hex"
            name="hex"
            value={state.hex}
            onChange={e => handleChange('hex', e.target.value)}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default NumberBase;
