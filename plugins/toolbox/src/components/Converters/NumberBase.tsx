import { useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
} from '../Buttons';
import { Flex, Text, TextField } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';

export const NumberBase = () => {
  const [state, setState] = useState({
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

    if (isNaN(base)) return;

    setState({
      binary: base.toString(2),
      octal: base.toString(8),
      decimal: base.toString(10),
      hex: base.toString(16),
    });
  };

  const NumberField = (props: {
    label: string;
    name: string;
    value: string;
  }) => (
    <div style={{ marginBottom: 'var(--bui-space-4)' }}>
      <Flex
        gap="2"
        align="center"
        style={{ marginBottom: 'var(--bui-space-1)' }}
      >
        <Text variant="body-small">{props.label}</Text>
        <PasteFromClipboardButton setInput={v => handleChange(props.name, v)} />
        <ClearValueButton setValue={() => handleChange(props.name, '')} />
        <CopyToClipboardButton output={props.value} />
      </Flex>
      <TextField
        id={props.name}
        label={props.label}
        value={props.value}
        onChange={val => handleChange(props.name, val)}
        autoComplete="off"
      />
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <NumberField
        label={t('tool.number-base-convert.base2')}
        name="binary"
        value={state.binary}
      />
      <NumberField
        label={t('tool.number-base-convert.base8')}
        name="octal"
        value={state.octal}
      />
      <NumberField
        label={t('tool.number-base-convert.base10')}
        name="decimal"
        value={state.decimal}
      />
      <NumberField
        label={t('tool.number-base-convert.base16')}
        name="hex"
        value={state.hex}
      />
    </div>
  );
};

export default NumberBase;
