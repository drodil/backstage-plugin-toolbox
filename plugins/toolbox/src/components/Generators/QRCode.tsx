import React from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { faker } from '@faker-js/faker';
import QRCode from "react-qr-code";

export const QRCodeGenerator = () => {
  const [input, setInput] = React.useState('');
  const sample = faker.internet.url();

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      sample={sample}
      rightContent={
        <QRCode value={input} />
      }
    />
  );
};

export default QRCodeGenerator;
