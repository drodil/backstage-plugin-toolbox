import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';

const charCodeMap = {
  '\\n': 13,
  '\\t': 9,
  '\\b': 8,
  '\\\\': 220,
  "\\'": 222,
  '\\"': 34,
};

export const Backslash = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Escape');

  useEffect(() => {
    if (mode === 'Escape') {
      const str = JSON.stringify(input);
      setOutput(str.substring(1, str.length - 1));
    } else {
      let str = input;
      for (const [key, value] of Object.entries(charCodeMap)) {
        str = str.replaceAll(key, String.fromCharCode(value));
      }
      setOutput(str);
    }
  }, [input, mode]);

  return (
    <>
      <ContentHeader title="Backslash escape/unescape" />
      <DefaultEditor
        input={input}
        mode={mode}
        setInput={setInput}
        setMode={setMode}
        output={output}
        modes={['Escape', 'Unescape']}
        sample={mode === 'Escape' ? 'Hello\t"World"' : 'Hello\\t\\"World\\"'}
      />
    </>
  );
};
