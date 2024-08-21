import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { xml2json } from 'xml-js';
import { JsonSpaceSelector } from '../DefaultEditor/JsonSpaceSelector';
import { useToolboxTranslation } from '../../hooks';

export const XmlToJson = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [spaces, setSpaces] = React.useState(4);
  const { t } = useToolboxTranslation();

  const sample =
    '<elements><element id="123"/><element id="325" name="April"/></elements>';

  useEffect(() => {
    try {
      const json = xml2json(input);
      const obj = JSON.parse(json);
      setOutput(JSON.stringify(obj, null, spaces));
    } catch (e) {
      setOutput(`${t('tool.xml-to-json-convert.invalidFormat')}: ${e.message}`);
    }
  }, [input, spaces, t]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      output={output}
      sample={sample}
      allowFileUpload
      inputLabel="XML"
      outputLabel="JSON"
      acceptFileTypes=".xml"
      additionalTools={[
        <JsonSpaceSelector spaces={spaces} onChange={setSpaces} />,
      ]}
      allowFileDownload
      downloadFileName="download.json"
      downloadFileType="application/json"
    />
  );
};

export default XmlToJson;
