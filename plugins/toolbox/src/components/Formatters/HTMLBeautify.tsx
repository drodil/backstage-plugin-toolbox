import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import beautify from 'js-beautify';

export const HTMLBeautify = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const sample =
    '<html><head><title>BACKSTAGE FTW!!</title></head><body><p>BACKSTAGE IS THE BEST!!</p></body></html>';

  useEffect(() => {
    let err;

    try {
      setOutput(beautify.html_beautify(input));
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
    />
  );
};

export default HTMLBeautify;
