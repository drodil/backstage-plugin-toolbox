import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';

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
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Encode');

  useEffect(() => {
    if (mode === 'Encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
    }
  }, [input, mode]);

  return (
    <>
      <ContentHeader title="HTML entity encode/decode" />
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
    </>
  );
};

export default HtmlEntities;
