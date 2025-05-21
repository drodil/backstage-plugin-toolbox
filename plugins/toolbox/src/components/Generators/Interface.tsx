import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from 'quicktype-core';

import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const formatOptions = [
  'TypeScript',
  'Ruby',
  'JavaScript',
  'Flow',
  'Rust',
  'Kotlin',
  'Dart',
  'Python',
  'C#',
  'Go',
  'C++',
  'Java',
  'Scala3',
  'Swift',
  'Objective-C',
  'Elm',
  'JSON Schema',
  'Pike',
  'JavaScript PropTypes',
  'Haskell',
  'PHP',
  undefined,
] as const;
type FormatOption = (typeof formatOptions)[number];

export const Interface = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<FormatOption>('TypeScript');

  const typeSelect = (
    <Select
      label="format"
      value={format}
      onChange={val => setFormat(val.target.value as FormatOption)}
      variant="standard"
    >
      {formatOptions.map(opt => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </Select>
  );

  useEffect(() => {
    quicktypeJSON(format, input)
      .then(({ lines }) => {
        setOutput(lines.join('\n'));
      })
      .catch((error: any) => {
        setOutput(error);
      });
  }, [input, format]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      additionalTools={[typeSelect]}
      output={output}
    />
  );
};

export default Interface;

async function quicktypeJSON(targetLanguage: FormatOption, jsonString: string) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage!);

  await jsonInput.addSource({
    name: 'MyInterface',
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: { 'just-types': 'true' },
  });
}
