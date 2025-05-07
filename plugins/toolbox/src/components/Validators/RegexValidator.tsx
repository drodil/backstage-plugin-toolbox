import React, { useEffect } from 'react';
import { TripleEditor } from '../DefaultEditor/TripleEditor';

export const RegexValidator = () => {
  const [input, setInput] = React.useState('');
  const [pattern, setPattern] = React.useState('');
  const [output, setOutput] = React.useState('');

  function isRegexValid(inputStr: string, patternStr: string): string {
    const flags = 'gim'; // g=global, m=match line start/end, i=case insensitive
    const regex = new RegExp(patternStr, flags);
    const testResults = regex.exec(inputStr);
    if (testResults === null) {
      return "pattern doesn't match the input text";
    }
    let result = '';
    for (let i = 0; i < testResults.length; ++i) {
      if (testResults[i].length === 0) {
        result += 'no match or empty!';
      } else {
        result += `${i + 1}. match="${testResults[i]}" on index=${
          testResults.index
        }\n`;
      }
    }
    return result;
  }

  useEffect(() => {
    let outputStr = '';
    try {
      // regex check
      outputStr = isRegexValid(input, pattern);
    } catch (error) {
      outputStr = `there was an exception while parsing your regex\n\nerrormessage=${error.message}`;
    }
    setOutput(outputStr);
  }, [input, pattern]); // changes in these two fields trigger the change of output

  return (
    <TripleEditor
      input={input}
      setInput={setInput}
      pattern={pattern}
      setPattern={setPattern}
      output={output}
      setOutput={setOutput}
      minRows={20}
      inputLabel="Input"
      patternLabel="Regex-Pattern"
      outputLabel="Output"
      sample="this is a test-text to test your regex expression"
    />
  );
};

export default RegexValidator;
