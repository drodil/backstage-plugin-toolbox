import { useState } from 'react';
import * as colorConvert from 'color-convert';
import {
  CMYK,
  HEX,
  HSL,
  HSV,
  KEYWORD,
  LAB,
  LCH,
  RGB,
} from 'color-convert/conversions';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import {
  Box,
  Divider,
  FormControl,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

export const ColorConverter = () => {
  const [input, setInput] = useState('');
  const [hex, setHex] = useState<HEX>('');
  const [rgb, setRgb] = useState<RGB>([0, 0, 0]);
  const [hsl, setHsl] = useState<HSL>([0, 0, 0]);
  const [hsv, setHsv] = useState<HSV>([0, 0, 0]);
  const [cmyk, setCmyk] = useState<CMYK>([0, 0, 0, 0]);
  const [html, setHtml] = useState<KEYWORD | null>(null);
  const [lab, setLab] = useState<LAB>([0, 0, 0]);
  const [lch, setLch] = useState<LCH>([0, 0, 0]);
  const sample = '#d50032';
  const { t } = useToolboxTranslation();

  enum ColorType {
    Hex = 'HEX',
    Rgb = 'RGB',
    Hsl = 'HSL',
    Hsv = 'HSV',
    Cmyk = 'CMYK',
    Html = 'HTML',
    Lab = 'LAB',
    Lch = 'LCH',
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
      case color.includes('lab'):
        return ColorType.Lab;
      case color.includes('lch'):
        return ColorType.Lch;
      default:
        return null;
    }
  };

  const parseRgb = ([r, g, b]: RGB): string => `rgb(${r},${g},${b})`;

  const parseHsl = ([h, s, l]: HSL): string => `hsl(${h},${s}%,${l}%)`;

  const parseHsv = ([h, s, v]: HSV): string => `hsv(${h},${s}%,${v}%)`;

  const parseCmyk = ([c, m, y, k]: CMYK): string =>
    `cmyk(${c}%,${m}%,${y}%,${k}%)`;

  const parseLab = ([l, a, b]: LAB): string => `lab(${l},${a},${b})`;
  const parseLch = ([l, c, h]: LCH): string => `lch(${l},${c},${h})`;

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
    setLab([0, 0, 0]);
    setLch([0, 0, 0]);
  };

  const handleHex = (value: string) => {
    try {
      setHex(value);
      setRgb(colorConvert.hex.rgb(value));
      setHsl(colorConvert.hex.hsl(value));
      setHsv(colorConvert.hex.hsv(value));
      setCmyk(colorConvert.hex.cmyk(value));
      setHtml(colorConvert.hex.keyword(value));
      setLab(colorConvert.hex.lab(value));
      setLch(colorConvert.hex.lch(value));
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
      setLab(colorConvert.rgb.lab(values));
      setLch(colorConvert.rgb.lch(values));
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
      setLab(colorConvert.hsl.lab(values));
      setLch(colorConvert.hsl.lch(values));
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
      setLab(colorConvert.hsv.lab(values));
      setLch(colorConvert.hsv.lch(values));
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
      setLab(colorConvert.cmyk.lab(values));
      setLch(colorConvert.cmyk.lch(values));
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleLab = (value: string) => {
    const values: LAB = removeCharacters(value, 'lab')
      .split(',')
      .map((val: string) => parseInt(val, 10)) as LAB;

    try {
      setHex(`#${colorConvert.lab.hex(values)}`);
      setRgb(colorConvert.lab.rgb(values));
      setHsl(colorConvert.lab.hsl(values));
      setHsv(colorConvert.lab.hsv(values));
      setLab(values);
      setLch(colorConvert.lab.lch(values));
      setHtml(colorConvert.lab.keyword(values));
    } catch (error) {
      handleNoMatch();
    }
  };

  const handleLch = (value: string) => {
    const values: LCH = removeCharacters(value, 'lch')
      .split(',')
      .map((val: string) => parseInt(val, 10)) as LCH;

    try {
      setHex(`#${colorConvert.lch.hex(values)}`);
      setRgb(colorConvert.lch.rgb(values));
      setHsl(colorConvert.lch.hsl(values));
      setHsv(colorConvert.lch.hsv(values));
      setLab(colorConvert.lch.lab(values));
      setLch(values);
      setHtml(colorConvert.lch.keyword(values));
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
      setLab(colorConvert.keyword.lab(value));
      setLch(colorConvert.keyword.lch(value));
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
      case ColorType.Lab:
        handleLab(value);
        break;
      case ColorType.Lch:
        handleLch(value);
        break;
      default:
        setHex('');
        setRgb([0, 0, 0]);
        setHsl([0, 0, 0]);
        setHsv([0, 0, 0]);
        setCmyk([0, 0, 0, 0]);
        setHtml(null);
        setLab([0, 0, 0]);
        setLch([0, 0, 0]);
        break;
    }
  };

  const OutputField = (props: { label: string; value?: string | null }) => {
    const { label, value } = props;
    return (
      <div style={{ marginBottom: '1rem', width: '100%' }}>
        <TextField
          label={label}
          style={{ width: '100%' }}
          disabled
          value={value ?? ''}
          autoComplete="off"
        />
        <CopyToClipboardButton output={value ?? ''} />
      </div>
    );
  };

  return (
    <FormControl style={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Typography variant="subtitle1">
            <PasteFromClipboardButton setInput={v => handleChange(v)} />
            <ClearValueButton setValue={() => handleChange('')} />
            {sample && <SampleButton setInput={handleChange} sample={sample} />}
          </Typography>
          <TextField
            id="input"
            name="input"
            label={t('tool.color-convert.inputLabel')}
            value={getInputStr()}
            style={{ width: '100%', marginTop: '1rem' }}
            onChange={e => handleChange(e.target.value)}
            variant="outlined"
            autoComplete="off"
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
          <OutputField label="Lab" value={parseLab(lab)} />
          <OutputField label="lch" value={parseLch(lch)} />
        </Grid>
        <Grid item lg={6} md={4} xs={12}>
          <Box bgcolor={hex} style={{ margin: '1rem', height: '50vh' }} />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default ColorConverter;
