import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';
import YAML from 'yaml';

export const JsonToYaml = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  useEffect(() => {
    let obj;
    try {
      obj = JSON.parse(input);
    } catch (e) {
      // NOOP
    }

    if (obj) {
      setOutput(YAML.stringify(obj));
    } else if (input) {
      setOutput('Invalid JSON');
    } else {
      setOutput('');
    }
  }, [input]);

  return (
    <>
      <ContentHeader title="JSON to YAML" />
      <DefaultEditor input={input} setInput={setInput} output={output} />
    </>
  );
};
