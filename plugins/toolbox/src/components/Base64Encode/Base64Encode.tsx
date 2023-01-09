import React, { useEffect } from 'react';
import { VerticalConverter } from '../VerticalConverter/VerticalConverter';
import { ContentHeader } from '@backstage/core-components';

export const Base64Encode = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Encode');

  useEffect(() => {
    if (mode === 'Encode') {
      setOutput(Buffer.from(input).toString('base64'));
    } else {
      setOutput(Buffer.from(input, 'base64').toString());
    }
  }, [input, mode]);

  return (
    <>
      <ContentHeader title="Base64 encode/decode" />
      <VerticalConverter
        input={input}
        mode={mode}
        setInput={setInput}
        setMode={setMode}
        output={output}
        modes={['Encode', 'Decode']}
      />
    </>
  );
};
