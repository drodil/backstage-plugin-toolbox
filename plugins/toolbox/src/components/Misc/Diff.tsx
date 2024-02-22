import { DiffEditor, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  Tooltip,
} from '@material-ui/core';
import { useStyles } from '../../utils/hooks';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { Select, SelectItem } from '@backstage/core-components';

import {
  ClearValueButton,
  CopyToClipboardButton,
  FileUploadButton,
  PasteFromClipboardButton,
} from '../Buttons';
import Input from '@material-ui/icons/Input';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';

loader.config({ monaco });

export type MonacoLanguages = { name: string; extensions: string[] };

type SampleButtonProps = {
  sample: string[];
  setInput: (input: string[]) => void;
};

const options: monaco.editor.IDiffEditorConstructionOptions = {
  originalEditable: true,
  diffCodeLens: true,
  dragAndDrop: true,
  tabCompletion: 'on',
  renderSideBySide: true,
};

function getLanguage(allowedLanguages: MonacoLanguages[], extension: string) {
  return allowedLanguages.find(monacoLanguage =>
    monacoLanguage.extensions.includes(extension as string),
  )?.name;
}

function readFileAndSetText(
  file: File | undefined,
  setText: (value: ((prevState: string) => string) | string) => void,
  setLanguage: (value: ((prevState: string) => string) | string) => void,
  allowedLanguages: MonacoLanguages[],
) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = async e => {
    // @ts-ignore
    setText(e.target.result);
  };
  reader.readAsText(file);
  let newLanguage = 'plaintext';
  const extension = `.${file.name.split('.').pop()}`;
  if (allowedLanguages?.length) {
    newLanguage = getLanguage(allowedLanguages, extension) || newLanguage;
  }
  setLanguage(newLanguage);
}

export const SampleButton = (props: SampleButtonProps) => {
  const { sample, setInput } = props;
  return (
    <Tooltip arrow title="Input sample">
      <Button
        size="small"
        startIcon={<Input />}
        onClick={() => setInput(sample)}
      >
        Sample
      </Button>
    </Tooltip>
  );
};

function Diff() {
  const styles = useStyles();
  const appThemeApi = useApi(appThemeApiRef);
  const theme = useMemo(
    () => appThemeApi.getActiveThemeId() ?? 'light',
    [appThemeApi],
  );
  const [originalFile, setOriginalFile] = useState<File>();
  const [modifiedFile, setModifiedFile] = useState<File>();

  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');

  const [language, setLanguage] = useState('plaintext');
  const [allowedLanguages, setAllowedLanguages] = useState<MonacoLanguages[]>(
    [],
  );

  const exampleOriginalText = 'Backstage toolbox\n\ncompare text';
  const exampleModifiedText = 'Backstage toolbox\ndiff editor';
  const handleLanguageSelect = (selected: any) => {
    setLanguage(selected);
  };

  useEffect(() => {
    readFileAndSetText(
      modifiedFile,
      setModifiedText,
      setLanguage,
      allowedLanguages,
    );
  }, [modifiedFile, allowedLanguages]);

  useEffect(() => {
    readFileAndSetText(
      originalFile,
      setOriginalText,
      setLanguage,
      allowedLanguages,
    );
  }, [originalFile, allowedLanguages]);

  useEffectOnce(() => {
    const languages: MonacoLanguages[] = monaco.languages
      .getLanguages()
      .map(each => {
        return { name: each.id, extensions: each.extensions || [] };
      });
    setAllowedLanguages(languages);
  });

  const languageOptions: SelectItem[] = allowedLanguages
    ? allowedLanguages.map(i => ({ label: i.name, value: i.name }))
    : [{ label: 'Loading...', value: 'loading' }];

  return (
    <>
      <FormControl className={styles.fullWidth}>
        <Grid container style={{ width: '100%' }}>
          <Grid item style={{ minWidth: '200px' }}>
            <Select
              selected={language}
              onChange={handleLanguageSelect}
              items={languageOptions}
              label="Select Text Language"
            />
          </Grid>
        </Grid>
        <Grid container style={{ width: '100%' }}>
          <Grid item>
            {exampleOriginalText && exampleModifiedText && (
              <SampleButton
                setInput={input => {
                  setOriginalText(input[0]);
                  setModifiedText(input[1]);
                }}
                sample={[exampleOriginalText, exampleModifiedText]}
              />
            )}
          </Grid>
        </Grid>
        <Grid container style={{ marginBottom: '5px', width: '100%' }}>
          <Grid item style={{ width: '50%' }}>
            <ButtonGroup size="small">
              <FileUploadButton
                onFileLoad={setOriginalFile}
                id="originalFile"
                buttonText="Original File"
              />
              <ClearValueButton setValue={setOriginalText} />
              <PasteFromClipboardButton setInput={setOriginalText} />
              {originalText && <CopyToClipboardButton output={originalText} />}
            </ButtonGroup>
          </Grid>
          <Grid item style={{ width: '50%' }}>
            <ButtonGroup size="small">
              <FileUploadButton
                onFileLoad={setModifiedFile}
                id="modifiedFile"
                buttonText="Modified File"
              />
              <ClearValueButton setValue={setModifiedText} />
              <PasteFromClipboardButton setInput={setModifiedText} />
              {modifiedText && <CopyToClipboardButton output={modifiedText} />}
            </ButtonGroup>
          </Grid>
        </Grid>
        <DiffEditor
          height="100vh"
          original={originalText}
          theme={theme.includes('dark') ? 'vs-dark' : 'vs-light'}
          modified={modifiedText}
          options={options}
          language={language}
        />
      </FormControl>
    </>
  );
}

export default Diff;
