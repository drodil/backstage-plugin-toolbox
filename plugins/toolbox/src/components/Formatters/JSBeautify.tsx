import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import beautify from 'js-beautify';
import { useToolboxTranslation } from '../../hooks';

export const JSBeautify = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const { t } = useToolboxTranslation();

  const sample =
    '[{"type": "car","name": "pedro","stars": 3},{"type": "plant","name": "samuel","stars": 2}]';

  useEffect(() => {
    let err;

    try {
      setOutput(beautify(input));
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
      inputLabel={t('tool.format-js.inputLabel')}
      outputLabel={t('tool.format-js.outputLabel')}
      acceptFileTypes=".js,.jsx,.ts,.tsx,.json"
      allowFileDownload
      downloadFileName="download.js"
      downloadFileType="text/javascript"
    />
  );
};

export default JSBeautify;
