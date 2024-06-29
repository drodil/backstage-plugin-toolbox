import React, { useEffect, useCallback } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import {
  camelCase,
  capitalize,
  kebabCase,
  lowerCase,
  snakeCase,
  upperCase,
} from 'lodash';
import TextField from "@mui/material/TextField";
import CheckBox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

export const StringUtilities = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Replace');
  const [searchWord, setSearchWord] = React.useState('');
  const [replaceWord, setReplaceWord] = React.useState('');
  const [isUseRegexpEnabled, setIsUseRegexpEnabled] = React.useState(false);

  const sample = [
    'requestURLDecoder',
    'HTTP_CLIENT_FACTORY',
    'generic_activity',
    'WeirdActivity',
    'kebab-is-good',
    'Normal text',
  ].join('\n');

  const mapLinesAndJoin = (str: string, callback: (line: string) => string) => {
    return str.split('\n').map(callback).join('\n');
  }

  const transformString = useCallback((
    inputString: string,
    transformMode: string,
    search: string,
    replace: string,
    useRegexp: boolean
  ) => {
    switch (transformMode) {
      case 'Replace':
        if (!useRegexp) {
          return inputString.replaceAll(search, replace);
        }
        try {
          return inputString.replace(new RegExp(search, 'g'), replace);
        } catch (e) {
          throw new Error(`Invalid RegExp: ${e.message}`);
        }
      case 'Camel':
        return mapLinesAndJoin(inputString, camelCase);
      case 'Snake':
        return mapLinesAndJoin(inputString, snakeCase);
      case 'Kebab':
        return mapLinesAndJoin(inputString, kebabCase);
      case 'Upper':
        return mapLinesAndJoin(inputString, upperCase);
      case 'Lower':
        return mapLinesAndJoin(inputString, lowerCase);
      case 'Capitalize':
        return mapLinesAndJoin(inputString, capitalize);
      default:
        return inputString;
    }
  }, [])

  useEffect(() => {
    if (mode !== 'Replace' && (searchWord !== '' || replaceWord !== '')) {
      setSearchWord('');
      setReplaceWord('');
    }

    try {
      setOutput(transformString(input, mode, searchWord, replaceWord, isUseRegexpEnabled));
    } catch (e) {
      setOutput(e.message);
    }
  }, [input, mode, searchWord, replaceWord, isUseRegexpEnabled, transformString]);

  const extraLeftContent = (mode === 'Replace') ?
    (
      <Box display="flex" style={{alignItems: 'center', padding: '8px 0 0 8px'}}>
        <TextField label="search" onChange={(event) => setSearchWord(event.target.value)} variant="outlined" />
        <Box style={{paddingLeft: "16px"}}>
          <FormControlLabel
            control={<CheckBox checked={isUseRegexpEnabled} onClick={() => setIsUseRegexpEnabled(!isUseRegexpEnabled)}/>}
            label="Regexp"/>
        </Box>
        <TextField label="replace" onChange={(event) => setReplaceWord(event.target.value)}/>
      </Box> ) : undefined;

  return (
    <DefaultEditor
      input={input}
      mode={mode}
      setInput={setInput}
      setMode={setMode}
      output={output}
      modes={['Replace', 'Camel', 'Snake', 'Kebab', 'Upper', 'Lower', 'Capitalize']}
      sample={sample}
      extraLeftContent={extraLeftContent}
    />
  );
};

export default StringUtilities;
