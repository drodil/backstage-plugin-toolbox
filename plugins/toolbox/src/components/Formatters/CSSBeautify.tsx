import { useState, useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import beautify from 'js-beautify';
import { useToolboxTranslation } from '../../hooks';

export const CSSBeautify = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useToolboxTranslation();

  const sample =
    '.selector_1 {width: 10px;font-size:2px;} #backstage_ftw {font-size: 200px; content: "BACKSTAGE IS THE BEST!"}';

  useEffect(() => {
    let err;

    try {
      setOutput(beautify.css_beautify(input));
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
      inputLabel={t('tool.format-css.inputLabel')}
      outputLabel={t('tool.format-css.outputLabel')}
      acceptFileTypes=".css"
      allowFileDownload
      downloadFileName="download.css"
      downloadFileType="text/css"
    />
  );
};

export default CSSBeautify;
