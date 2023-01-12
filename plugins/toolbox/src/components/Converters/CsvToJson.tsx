import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';
import csvToJson from 'csvtojson';

export const CsvToJson = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const sample =
    'color,maxSpeed,type\n' +
    '"red",120,"truck"\n' +
    '"blue",100,"panzerwagen"\n' +
    '"green",130,"suv"';

  useEffect(() => {
    const getJson = async (value: string) => {
      const obj = await csvToJson().fromString(value);
      return JSON.stringify(obj, null, 4);
    };

    getJson(input)
      .then(val => setOutput(val))
      .catch(e => setOutput(`Invalid CSV: ${e.message}`));
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

export default CsvToJson;
