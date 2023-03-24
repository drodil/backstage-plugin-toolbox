import { useStyles } from '../../utils/hooks';
import React from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import * as colorConvert from 'color-convert';
import { CMYK, HSV, RGB, HSL, KEYWORD, HEX } from 'color-convert/conversions';
import { PasteFromClipboardButton } from '../Buttons/PasteFromClipboardButton';
import { ClearValueButton } from '../Buttons/ClearValueButton';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';

export const ColorConverter = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState('');
  const [hex, setHex] = React.useState<HEX>('');
  const [rgb, setRgb] = React.useState<RGB>([0, 0, 0]);
  const [hsl, setHsl] = React.useState<HSL>([0, 0, 0]);
  const [hsv, setHsv] = React.useState<HSV>([0, 0, 0]);
  const [cmyk, setCmyk] = React.useState<CMYK>([0, 0, 0, 0]);
  const [html, setHtml] = React.useState<KEYWORD | null>(null);
  const sample = '#d50032';

  enum ColorType {
    Hex = 'HEX',
    Rgb = 'RGB',
    Hsl = 'HSL',
    Hsv = 'HSV',
    Cmyk = 'CMYK',
    Html = 'HTML',
  }

  const getInputStr = () => input || '';

  const getColorType = (color: string) => {
    switch (true) {
      case color.includes('#'):
        return ColorType.Hex;
      case color.includes('rgb'):
        return ColorType.Rgb;
      case color.includes('hsl'):
        return ColorType.Hsl;
      case color.includes('hsv'):
        return ColorType.Hsv;
      case color.includes('cmyk'):
        return ColorType.Cmyk;
      case colorConvert.keyword.rgb(color as KEYWORD)?.length === 3:
        return ColorType.Html;
      default:
        return null;
    }
  };

  const parseRgb = ([r, g, b]: RGB): string => `rgb(${r},${g},${b})`;

  const parseHsl = ([h, s, l]: HSL): string => `hsl(${h},${s}%,${l}%)`;

  const parseHsv = ([h, s, v]: HSV): string => `hsv(${h},${s}%,${v}%)`;

  const parseCmyk = ([c, m, y, k]: CMYK): string =>
    `cmyk(${c}%,${m}%,${y}%,${k}%)`;

  const removeCharacters = (value: string, colorType: string) => {
    return value
      .replace(/\s/g, '')
      .replace(colorType, '')
      .replace('(', '')
      .replace(')', '');
  };

  const handleNoMatch = () => {
    setHex('');
    setRgb([0, 0, 0]);
    setHsl([0, 0, 0]);
    setHsv([0, 0, 0]);
    setCmyk([0, 0, 0, 0]);
    setHtml(null);
  };

  const handleHex = (value: string) => {
    try {
      setHex(value);
      setRgb(colorConvert.hex.rgb(value));
      setHsl(colorConvert.hex.hsl(value));
      setHsv(colorConvert.hex.hsv(value));
      setCmyk(colorConvert.hex.cmyk(value));
      setHtml(colorConvert.hex.keyword(value));
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleRgb = (value: string) => {
    const values: RGB = removeCharacters(value, 'rgb')
      .split(',')
      .map((val: string) => parseInt(val, 10)) as RGB;

    try {
      setHex(`#${colorConvert.rgb.hex(values)}`);
      setRgb(values);
      setHsl(colorConvert.rgb.hsl(values));
      setHsv(colorConvert.rgb.hsv(values));
      setCmyk(colorConvert.rgb.cmyk(values));
      setHtml(colorConvert.rgb.keyword(values));
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleHsl = (value: string) => {
    const values: HSL = removeCharacters(value, 'hsl')
      .split(',')
      .map((val: string) => parseInt(val, 10)) as HSL;
    try {
      setHex(`#${colorConvert.hsl.hex(values)}`);
      setRgb(colorConvert.hsl.rgb(values));
      setHsl(values);
      setHsv(colorConvert.hsl.hsv(values));
      setCmyk(colorConvert.hsl.cmyk(values));
      setHtml(colorConvert.hsl.keyword(values));
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleHsv = (value: string) => {
    const values: HSV = removeCharacters(value, 'hsv')
      .split(',')
      .map((val: string) => parseInt(val, 10)) as HSV;
    try {
      setHex(`#${colorConvert.hsv.hex(values)}`);
      setRgb(colorConvert.hsv.rgb(values));
      setHsl(colorConvert.hsv.hsl(values));
      setHsv(values);
      setCmyk(colorConvert.hsv.cmyk(values));
      setHtml(colorConvert.hsv.keyword(values));
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleCmyk = (value: string) => {
    const values: CMYK = removeCharacters(value, 'cmyk')
      .split(',')
      .map((val: string) => parseInt(val, 10)) as CMYK;

    try {
      setHex(`#${colorConvert.cmyk.hex(values)}`);
      setRgb(colorConvert.cmyk.rgb(values));
      setHsl(colorConvert.cmyk.hsl(values));
      setHsv(colorConvert.cmyk.hsv(values));
      setCmyk(values);
      setHtml(colorConvert.cmyk.keyword(values));
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleHtml = (value: KEYWORD) => {
    try {
      setHex(`#${colorConvert.keyword.hex(value)}`);
      setRgb(colorConvert.keyword.rgb(value));
      setHsl(colorConvert.keyword.hsl(value));
      setHsv(colorConvert.keyword.hsv(value));
      setCmyk(colorConvert.keyword.cmyk(value));
      setHtml(value);
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleChange = (value: any) => {
    setInput(value);
    const colorType = getColorType(value);

    switch (colorType) {
      case ColorType.Hex:
        handleHex(value);
        break;
      case ColorType.Rgb:
        handleRgb(value);
        break;
      case ColorType.Hsl:
        handleHsl(value);
        break;
      case ColorType.Hsv:
        handleHsv(value);
        break;
      case ColorType.Cmyk:
        handleCmyk(value);
        break;
      case ColorType.Html:
        handleHtml(value);
        break;
      default:
        setHex('');
        setRgb([0, 0, 0]);
        setHsl([0, 0, 0]);
        setHsv([0, 0, 0]);
        setCmyk([0, 0, 0, 0]);
        setHtml(null);
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
      <FormControl className={styles.fullWidth}>
        <Grid container>
          <Grid item xs={12} lg={6}>
            <Typography variant="subtitle1">
              Input
              <PasteFromClipboardButton setInput={v => handleChange(v)} />
              <ClearValueButton setValue={() => handleChange('')} />
              <Tooltip arrow title="Input sample">
                <Button size="small" onClick={() => handleChange(sample)}>
                  Sample
                </Button>
              </Tooltip>
            </Typography>
            <TextField
              id="input"
              name="input"
              value={getInputStr()}
              className={styles.fullWidth}
              onChange={e => handleChange(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Divider style={{ marginTop: '1rem', marginBottom: '1rem' }} />
        <Grid container>
          <Grid item lg={6} md={8} xs={12}>
            <OutputField label="Hex" value={hex} />
            <OutputField label="RGB" value={parseRgb(rgb)} />
            <OutputField label="HSL" value={parseHsl(hsl)} />
            <OutputField label="HSV" value={parseHsv(hsv)} />
            <OutputField label="CMYK" value={parseCmyk(cmyk)} />
            <OutputField label="HTML" value={html} />
          </Grid>
          <Grid item lg={6} md={4} xs={12}>
            <Box bgcolor={hex} style={{ height: '50vh' }} />
          </Grid>
        </Grid>
      </FormControl>
    </>
  );
};

export default ColorConverter;
