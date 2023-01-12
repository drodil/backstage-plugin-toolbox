import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';
import {
  camelCase,
  capitalize,
  kebabCase,
  lowerCase,
  snakeCase,
  upperCase,
} from 'lodash';

export const StringCase = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Camel');
  const sample = [
    'requestURLDecoder',
    'HTTP_CLIENT_FACTORY',
    'generic_activity',
    'WeirdActivity',
    'kebab-is-good',
    'Normal text',
  ].join('\n');

  useEffect(() => {
    let strings = input.split('\n');
    switch (mode) {
      default:
      case 'Camel':
        strings = strings.map(camelCase);
        break;
      case 'Snake':
        strings = strings.map(snakeCase);
        break;
      case 'Kebab':
        strings = strings.map(kebabCase);
        break;
      case 'Upper':
        strings = strings.map(upperCase);
        break;
      case 'Lower':
        strings = strings.map(lowerCase);
        break;
      case 'Capitalize':
        strings = strings.map(capitalize);
        break;
    }
    setOutput(strings.join('\n'));
  }, [input, mode]);

  return (
    <>
      <ContentHeader title="String Case Converter" />
      <DefaultEditor
        input={input}
        mode={mode}
        setInput={setInput}
        setMode={setMode}
        output={output}
        modes={['Camel', 'Snake', 'Kebab', 'Upper', 'Lower', 'Capitalize']}
        sample={sample}
      />
    </>
  );
};

export default StringCase;
