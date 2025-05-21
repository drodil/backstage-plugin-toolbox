import { useState, useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor';

const decode = (value: string): string => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = value;
  return textArea.value;
};

const encode = (value: string): string => {
  const textArea = document.createElement('textarea');
  textArea.innerText = value;
  return textArea.innerHTML;
};

export const HtmlEntities = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('Encode');

  useEffect(() => {
    if (mode === 'Encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
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
      sample={
        mode === 'Encode'
          ? '& there it was >.<'
          : '&amp; there it was &gt;.&lt;'
      }
    />
  );
};

export default HtmlEntities;
