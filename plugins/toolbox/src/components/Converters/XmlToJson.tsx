import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';
import { xml2json } from 'xml-js';

export const XmlToJson = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const sample =
    '<elements><element id="123"/><element id="325" name="April"/></elements>';

  useEffect(() => {
    try {
      const json = xml2json(input);
      const obj = JSON.parse(json);
      setOutput(JSON.stringify(obj, null, 4));
    } catch (e) {
      setOutput(`Invalid XML provided: ${e.message}`);
    }
  }, [input]);

  return (
    <>
      <ContentHeader title="CSV to JSON" />
      <DefaultEditor
        input={input}
        setInput={setInput}
        output={output}
        sample={sample}
      />
    </>
  );
};

export default XmlToJson;
