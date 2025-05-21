import { useState, useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor';

export const Base64Encode = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('Encode');

  useEffect(() => {
    if (mode === 'Encode') {
      setOutput(Buffer.from(input).toString('base64'));
    } else {
      setOutput(Buffer.from(input, 'base64').toString());
    }
  }, [input, mode]);

  return (
    <DefaultEditor
      input={input}
      mode={mode}
      setInput={setInput}
      setMode={setMode}
      output={output}
      modes={['Encode', 'Decode']}
      allowFileUpload
      sample={mode === 'Encode' ? 'Hello world!' : 'SGVsbG8gd29ybGQh'}
    />
  );
};

export default Base64Encode;
