import React from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { faker } from '@faker-js/faker';
import QRCode from 'react-qr-code';

export const QRCodeGenerator = () => {
  const [input, setInput] = React.useState('');
  const sample = faker.internet.url();

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      inputProps={{ maxLength: 2048 }}
      sample={sample}
      rightContent={<QRCode size={512} value={input.substring(0, 2048)} />}
    />
  );
};

export default QRCodeGenerator;
