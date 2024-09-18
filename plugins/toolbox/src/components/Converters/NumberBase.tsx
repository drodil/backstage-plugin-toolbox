import React from 'react';
import { useStyles } from '../../utils/hooks';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
} from '../Buttons';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useToolboxTranslation } from '../../hooks';

export const NumberBase = () => {
  const { classes } = useStyles();
  const [state, setState] = React.useState({
    binary: '',
    octal: '',
    decimal: '',
    hex: '',
  });
  const { t } = useToolboxTranslation();

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
    <>
      <FormControl className={classes.fullWidth}>
        <Typography variant="subtitle1">
          {t('tool.number-base-convert.base2')}
          <PasteFromClipboardButton setInput={v => handleChange('binary', v)} />
          <ClearValueButton setValue={() => handleChange('binary', '')} />
          <CopyToClipboardButton output={state.binary} />
        </Typography>
        <TextField
          className={classes.fullWidth}
          id="binary"
          name="binary"
          value={state.binary}
          onChange={e => handleChange('binary', e.target.value)}
          variant="outlined"
        />
        <Typography variant="subtitle1">
          {t('tool.number-base-convert.base8')}
          <PasteFromClipboardButton setInput={v => handleChange('octal', v)} />
          <ClearValueButton setValue={() => handleChange('octal', '')} />
          <CopyToClipboardButton output={state.octal} />
        </Typography>
        <TextField
          className={classes.fullWidth}
          id="octal"
          name="octal"
          value={state.octal}
          onChange={e => handleChange('octal', e.target.value)}
          variant="outlined"
        />
        <Typography variant="subtitle1">
          {t('tool.number-base-convert.base10')}
          <PasteFromClipboardButton
            setInput={v => handleChange('decimal', v)}
          />
          <ClearValueButton setValue={() => handleChange('decimal', '')} />
          <CopyToClipboardButton output={state.decimal} />
        </Typography>
        <TextField
          className={classes.fullWidth}
          id="decimal"
          name="decimal"
          value={state.decimal}
          onChange={e => handleChange('decimal', e.target.value)}
          variant="outlined"
        />
        <Typography variant="subtitle1">
          {t('tool.number-base-convert.base16')}
          <PasteFromClipboardButton setInput={v => handleChange('hex', v)} />
          <ClearValueButton setValue={() => handleChange('hex', '')} />
          <CopyToClipboardButton output={state.hex} />
        </Typography>
        <TextField
          className={classes.fullWidth}
          id="hex"
          name="hex"
          value={state.hex}
          onChange={e => handleChange('hex', e.target.value)}
          variant="outlined"
        />
      </FormControl>
    </>
  );
};

export default NumberBase;
