import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import YAML from 'yaml';

export const JsonToYaml = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const sample = JSON.stringify(
    [
      { type: 'car', name: 'pedro', stars: 3 },
      { type: 'plant', name: 'samuel', stars: 2 },
    ],
    null,
    4,
  );
  useEffect(() => {
    let obj;
    let err;
    try {
      obj = JSON.parse(input);
    } catch (e) {
      err = e.message;
    }

    if (obj) {
      setOutput(YAML.stringify(obj));
    } else if (input) {
      setOutput(err);
    } else {
      setOutput('');
    }
  }, [input]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      output={output}
      sample={sample}
      allowFileUpload
      inputLabel="JSON"
      outputLabel="YAML"
      acceptFileTypes=".json"
      allowFileDownload
      downloadFileName="download.yaml"
      downloadFileType="application/yaml"
    />
  );
};

export default JsonToYaml;
