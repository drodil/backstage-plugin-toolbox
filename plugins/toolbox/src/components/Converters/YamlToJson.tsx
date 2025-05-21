import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import YAML from 'yaml';
import { JsonSpaceSelector } from '../DefaultEditor/JsonSpaceSelector';

export const YamlToJson = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [spaces, setSpaces] = useState(4);
  const sample =
    '- type: car\n' +
    '  name: pedro\n' +
    '  stars: 3\n' +
    '- type: plant\n' +
    '  name: samuel\n' +
    '  stars: 2\n';

  useEffect(() => {
    let obj;
    let err;
    try {
      obj = YAML.parse(input);
    } catch (e) {
      err = e.message;
    }

    if (obj) {
      setOutput(JSON.stringify(obj, null, spaces));
    } else if (input) {
      setOutput(err);
    } else {
      setOutput('');
    }
  }, [input, spaces]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      output={output}
      sample={sample}
      allowFileUpload
      inputLabel="YAML"
      outputLabel="JSON"
      acceptFileTypes=".yaml,.yml"
      additionalTools={[
        <JsonSpaceSelector
          key="spaceSelector"
          spaces={spaces}
          onChange={setSpaces}
        />,
      ]}
      allowFileDownload
      downloadFileName="download.json"
      downloadFileType="application/json"
    />
  );
};

export default YamlToJson;
