import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { format } from 'sql-formatter';

export const SQLBeautify = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const sample = "SELECT bar, foo FROM foo_bar WHERE foo='bar' GROUP BY bar";

  useEffect(() => {
    let err;
    try {
      setOutput(format(input));
      return;
    } catch (e) {
      err = e.message;
    }

    if (input && err) {
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
      acceptFileTypes=".sql"
      inputLabel="Unformatted SQL"
      outputLabel="Formatted SQL"
      allowFileDownload
      downloadFileName="download.sql"
      downloadFileType="text/plain"
    />
  );
};

export default SQLBeautify;
