import React, { useEffect } from 'react';
import { VerticalConverter } from '../VerticalConverter/VerticalConverter';

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
    <VerticalConverter
      input={input}
      mode={mode}
      setInput={setInput}
      setMode={setMode}
      output={output}
      modes={['Encode', 'Decode']}
    />
  );
};
