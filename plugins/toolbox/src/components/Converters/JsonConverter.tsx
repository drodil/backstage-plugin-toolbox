import { useCallback, useEffect, useState } from 'react';
import { useToolboxTranslation } from '../../hooks';
import { DefaultEditor } from '../DefaultEditor';
import { Parser } from '@json2csv/plainjs';
import { parse as json5Parse } from 'json5';
import { stringify as yamlStringify } from 'yaml';
import styles from '../DefaultEditor/DefaultEditor.module.css';

const getFileType = (mode: string): string => {
  switch (mode) {
    case 'CSV':
      return 'text/csv';
    case 'YAML':
      return 'application/yaml';
    default:
      return 'text/plain';
  }
};

const parseInput = (input: string): object | string | undefined => {
  let obj;
  try {
    obj = json5Parse(input);
  } catch (e) {
    if (!input) {
      return '';
    }
    if (e instanceof Error) {
      return e.message;
    }
    return undefined;
  }
  return obj;
};

const convertInput = (input: string, mode: string): string | undefined => {
  if (!input) return '';

  const value = parseInput(input);
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }

  try {
    switch (mode) {
      case 'CSV':
        return new Parser().parse(value);
      case 'YAML':
        return yamlStringify(value);
      case 'String':
        return JSON.stringify(JSON.stringify(value));
      default:
        return '';
    }
  } catch (e) {
    return e instanceof Error ? e.message : undefined;
  }
};

export const JsonConverter = () => {
  const { t } = useToolboxTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('CSV');
  const sample = JSON.stringify(
    [
      { type: 'car', name: 'pedro', stars: 3 },
      { type: 'plant', name: 'samuel', stars: 2 },
    ],
    null,
    4,
  );

  const fileType = getFileType(mode);
  const handleConvert = useCallback(() => {
    const result = convertInput(input, mode);
    if (result === undefined) {
      setOutput(
        t('tool.json-converter.unexpectedError', {
          defaultValue: 'An unexpected error occurred',
        }),
      );
    } else {
      setOutput(result);
    }
  }, [input, mode, t]);

  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      output={output}
      sample={sample}
      mode={mode}
      setMode={setMode}
      modes={[
        t('tool.json-converter.mode.csv', { defaultValue: 'CSV' }),
        t('tool.json-converter.mode.string', { defaultValue: 'String' }),
        t('tool.json-converter.mode.yaml', { defaultValue: 'YAML' }),
      ]}
      allowFileUpload
      acceptFileTypes=".json"
      allowFileDownload
      downloadFileName={`download.${mode.toLowerCase()}`}
      downloadFileType={fileType}
      leftContent={
        <>
          <label htmlFor="input" className={styles.fieldLabel}>
            {t('tool.json-converter.inputLabel', {
              defaultValue: 'JSON Input',
            })}
          </label>
          <textarea
            name="editorJsonInput"
            id="input"
            className={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={20}
            autoComplete="off"
            spellCheck={false}
          />
        </>
      }
      rightContent={
        <>
          <label htmlFor="output" className={styles.fieldLabel}>
            {t('tool.json-converter.outputLabel', {
              defaultValue: 'Converted Output',
            })}
          </label>
          <textarea
            id="output"
            className={styles.textarea}
            value={output || ''}
            rows={20}
            autoComplete="off"
            spellCheck={false}
            readOnly
          />
        </>
      }
    />
  );
};
export default JsonConverter;
