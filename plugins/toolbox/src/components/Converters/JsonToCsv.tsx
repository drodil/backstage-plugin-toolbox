import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';
import { parse } from 'json2csv';

export const JsonToCsv = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  useEffect(() => {
    let obj;
    let err;
    try {
      obj = JSON.parse(input);
    } catch (e) {
      err = e.message;
    }

    if (obj) {
      try {
        setOutput(parse(obj));
        return;
      } catch (e) {
        err = e.message;
      }
    }

    if (input && err) {
      setOutput(err);
    } else {
      setOutput('');
    }
  }, [input]);

  return (
    <>
      <ContentHeader title="JSON to CSV" />
      <DefaultEditor input={input} setInput={setInput} output={output} />
    </>
  );
};
