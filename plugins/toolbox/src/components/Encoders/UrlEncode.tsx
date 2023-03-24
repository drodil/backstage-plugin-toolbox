import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';

export const UrlEncode = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Encode');

  useEffect(() => {
    let url = '';
    let errorMessage = '';
    try {
      url = mode === 'Encode' ? encodeURI(input) : decodeURI(input);
    } catch (error) {
      errorMessage = `couldn't ${
        mode === 'Encode' ? 'encode' : 'decode'
      } URL...`;
    }
    setOutput(url || errorMessage);
  }, [input, mode]);

  return (
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
    />
  );
};

export default UrlEncode;
