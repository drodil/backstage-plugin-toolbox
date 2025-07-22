import { useState, useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { EncoderModeSelector } from '../DefaultEditor/EncoderModeSelector';

export const UrlEncode = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('Encode');
  const [specialCharsMode, setSpecialCharsMode] = useState(
    'withoutSpecialCharacters',
  );

  useEffect(() => {
    let url = '';
    let errorMessage = '';
    try {
      if (mode === 'Encode') {
        url =
          specialCharsMode === 'withSpecialCharacters'
            ? encodeURIComponent(input)
            : encodeURI(input);
      } else {
        url =
          specialCharsMode === 'withSpecialCharacters'
            ? decodeURIComponent(input)
            : decodeURI(input);
      }
    } catch (error) {
      errorMessage = `couldn't ${
        mode === 'Encode' ? 'encode' : 'decode'
      } URL...`;
    }
    setOutput(url || errorMessage);
  }, [input, mode, specialCharsMode]);

  return (
    <DefaultEditor
      input={input}
      mode={mode}
      setInput={setInput}
      setMode={setMode}
      output={output}
      modes={['Encode', 'Decode']}
      additionalTools={[
        <EncoderModeSelector
          value={specialCharsMode}
          onChange={setSpecialCharsMode}
        />,
      ]}
      sample={
        mode === 'Encode'
          ? 'https://backstage.io/?query= hello\\world{}'
          : 'https://backstage.io/?query=%20hello%5Cworld%7B%7D'
      }
    />
  );
};

export default UrlEncode;
