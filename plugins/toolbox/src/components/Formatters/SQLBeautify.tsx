import { useState, useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { format } from 'sql-formatter';
import { useToolboxTranslation } from '../../hooks';

export const SQLBeautify = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useToolboxTranslation();

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
      inputLabel={t('tool.format-sql.inputLabel')}
      outputLabel={t('tool.format-sql.outputLabel')}
      allowFileDownload
      downloadFileName="download.sql"
      downloadFileType="text/plain"
    />
  );
};

export default SQLBeautify;
