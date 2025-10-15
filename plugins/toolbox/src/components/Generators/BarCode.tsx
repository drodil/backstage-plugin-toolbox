import { useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { faker } from '@faker-js/faker';
import Barcode from 'react-barcode';
import { DefaultSelect } from '../Selects';
import { MenuItem } from '@material-ui/core';

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
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<FormatOption>('CODE128');
  const sample = faker.number.bigInt().toString(10);

  const typeSelect = (
    <DefaultSelect
      label="format"
      value={format}
      onChange={val => setFormat(val.target.value as FormatOption)}
      variant="standard"
    >
      {formatOptions.map(opt => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </DefaultSelect>
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
