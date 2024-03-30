import React from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { faker } from '@faker-js/faker';
import Barcode from 'react-barcode';
import { MenuItem, Select } from '@material-ui/core';

const formatOptions = [
  'CODE39',
  'CODE128',
  'CODE128A',
  'CODE128B',
  'CODE128C',
  'EAN13',
  'EAN8',
  'EAN5',
  'EAN2',
  'UPC',
  'UPCE',
  'ITF14',
  'ITF',
  'MSI',
  'MSI10',
  'MSI11',
  'MSI1010',
  'MSI1110',
  'pharmacode',
  'codabar',
  'GenericBarcode',
  undefined,
] as const;
type FormatOption = (typeof formatOptions)[number];

export const BarCodeGenerator = () => {
  const [input, setInput] = React.useState('');
  const [format, setFormat] = React.useState<FormatOption>('CODE128');
  const sample = faker.number.bigInt().toString(10);

  const typeSelect = (
    <Select
      label="format"
      value={format}
      onChange={(val: React.ChangeEvent<{ value: unknown }>) =>
        setFormat(val.target.value as FormatOption)
      }
    >
      {formatOptions.map(opt => (
        <MenuItem value={opt}>{opt}</MenuItem>
      ))}
    </Select>
  );

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      additionalTools={[typeSelect]}
      sample={sample}
      rightContent={<Barcode value={input} format={format} />}
    />
  );
};

export default BarCodeGenerator;
