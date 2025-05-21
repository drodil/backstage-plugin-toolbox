import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import csvToJson from 'csvtojson';
import { JsonSpaceSelector } from '../DefaultEditor/JsonSpaceSelector';

export const CsvToJson = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [spaces, setSpaces] = useState(4);

  const sample =
    'color,maxSpeed,type\n' +
    '"red",120,"truck"\n' +
    '"blue",100,"panzerwagen"\n' +
    '"green",130,"suv"';

  useEffect(() => {
    const getJson = async (value: string) => {
      const obj = await csvToJson().fromString(value);
      return JSON.stringify(obj, null, spaces);
    };

    getJson(input)
      .then(val => setOutput(val))
      .catch(e => setOutput(`Invalid CSV: ${e.message}`));
  }, [input, spaces]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      output={output}
      sample={sample}
      inputLabel="CSV"
      outputLabel="JSON"
      allowFileUpload
      acceptFileTypes=".csv"
      allowFileDownload
      downloadFileName="download.json"
      downloadFileType="application/json"
      additionalTools={[
        <JsonSpaceSelector
          key="spaceSelector"
          spaces={spaces}
          onChange={setSpaces}
        />,
      ]}
    />
  );
};

export default CsvToJson;
