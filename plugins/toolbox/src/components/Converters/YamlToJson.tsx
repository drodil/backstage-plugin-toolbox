import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import YAML from 'yaml';
import { JsonSpaceSelector } from '../DefaultEditor/JsonSpaceSelector';

export const YamlToJson = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [spaces, setSpaces] = React.useState(4);
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
      additionalTools={[
        <JsonSpaceSelector spaces={spaces} onChange={setSpaces} />,
      ]}
    />
  );
};

export default YamlToJson;
