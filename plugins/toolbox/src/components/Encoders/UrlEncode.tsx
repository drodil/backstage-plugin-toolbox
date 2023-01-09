import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
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
      <DefaultEditor
        input={input}
        mode={mode}
        setInput={setInput}
        setMode={setMode}
        output={output}
        modes={['Encode', 'Decode']}
        sample={
          mode === 'Encode'
            ? 'https://backstage.io/?query= hello\\world{}'
            : 'https://backstage.io/?query=%20hello%5Cworld%7B%7D'
        }
      />{' '}
    </>
  );
};
