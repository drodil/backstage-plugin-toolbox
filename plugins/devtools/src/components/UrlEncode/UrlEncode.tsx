import React, { useEffect } from 'react';
import { VerticalConverter } from '../VerticalConverter/VerticalConverter';
import { ContentHeader } from '@backstage/core-components';

export const UrlEncode = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Encode');

  useEffect(() => {
    if (mode === 'Encode') {
      setOutput(encodeURI(input));
    } else {
      setOutput(decodeURI(input));
    }
  }, [input, mode]);

  return (
    <>
      <ContentHeader title="URL encode/decode" />
      <VerticalConverter
        input={input}
        mode={mode}
        setInput={setInput}
        setMode={setMode}
        output={output}
        modes={['Encode', 'Decode']}
      />{' '}
    </>
  );
};
