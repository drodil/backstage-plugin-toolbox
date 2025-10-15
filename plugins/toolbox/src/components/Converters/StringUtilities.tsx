import { useCallback, useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import {
  camelCase,
  capitalize,
  kebabCase,
  lowerCase,
  snakeCase,
  upperCase,
} from 'lodash';
import {
  Box,
  Checkbox as CheckBox,
  FormControlLabel,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  controlsGrid: {
    alignItems: 'center',
    padding: theme.spacing(1, 0, 0, 1), // 8px 0 0 8px
  },
  paddingBox: {
    paddingLeft: theme.spacing(2), // 16px
  },
}));

export const StringUtilities = () => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('Replace');
  const [searchWord, setSearchWord] = useState('');
  const [replaceWord, setReplaceWord] = useState('');
  const [isUseRegexpEnabled, setIsUseRegexpEnabled] = useState(false);
  const { t } = useToolboxTranslation();

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
  };

  const transformString = useCallback(
    (
      inputString: string,
      transformMode: string,
      search: string,
      replace: string,
      useRegexp: boolean,
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
    },
    [],
  );

  useEffect(() => {
    if (mode !== 'Replace' && (searchWord !== '' || replaceWord !== '')) {
      setSearchWord('');
      setReplaceWord('');
    }

    try {
      setOutput(
        transformString(
          input,
          mode,
          searchWord,
          replaceWord,
          isUseRegexpEnabled,
        ),
      );
    } catch (e) {
      setOutput(e.message);
    }
  }, [
    input,
    mode,
    searchWord,
    replaceWord,
    isUseRegexpEnabled,
    transformString,
  ]);

  const extraLeftContent =
    mode === 'Replace' ? (
      <Box display="flex" className={classes.controlsGrid}>
        <TextField
          label={t('tool.string-utilities-convert.inputSearch')}
          onChange={event => setSearchWord(event.target.value)}
          variant="outlined"
        />
        <Box className={classes.paddingBox}>
          <FormControlLabel
            control={
              <CheckBox
                checked={isUseRegexpEnabled}
                onClick={() => setIsUseRegexpEnabled(!isUseRegexpEnabled)}
              />
            }
            label="Regexp"
          />
        </Box>
        <TextField
          label={t('tool.string-utilities-convert.inputReplace')}
          onChange={event => setReplaceWord(event.target.value)}
        />
      </Box>
    ) : undefined;

  return (
    <DefaultEditor
      input={input}
      mode={mode}
      setInput={setInput}
      setMode={setMode}
      output={output}
      modes={[
        'Replace',
        'Camel',
        'Snake',
        'Kebab',
        'Upper',
        'Lower',
        'Capitalize',
      ]}
      sample={sample}
      extraLeftContent={extraLeftContent}
    />
  );
};

export default StringUtilities;
