import { DiffEditor, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { Select, SelectItem } from '@backstage/core-components';

import {
  ClearValueButton,
  CopyToClipboardButton,
  FileUploadButton,
  PasteFromClipboardButton,
} from '../Buttons';
import Input from '@mui/icons-material/Input';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useToolboxTranslation } from '../../hooks';

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
    monacoLanguage.extensions.includes(extension),
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
    newLanguage = getLanguage(allowedLanguages, extension) ?? newLanguage;
  }
  setLanguage(newLanguage);
}

export const SampleButton = (props: SampleButtonProps) => {
  const { sample, setInput } = props;
  const { t } = useToolboxTranslation();
  return (
    <Tooltip arrow title={t('components.sampleButton.tooltipTitle')}>
      <Button
        size="small"
        startIcon={<Input />}
        onClick={() => setInput(sample)}
        color="inherit"
      >
        {t('components.sampleButton.buttonText')}
      </Button>
    </Tooltip>
  );
};

const useSyncEditorValue = (
  getEditor: () => monaco.editor.IStandaloneCodeEditor | undefined,
  value: string,
) => {
  useEffect(() => {
    const editor = getEditor();
    if (editor && editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [value, getEditor]);
};

function Diff() {
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
  const { t } = useToolboxTranslation();

  const diffEditorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(
    null,
  );

  const onMount = useCallback(
    (editor: monaco.editor.IStandaloneDiffEditor) => {
      diffEditorRef.current = editor;

      const originalEditor = editor.getOriginalEditor();
      const modifiedEditor = editor.getModifiedEditor();

      const disposables = [
        originalEditor.onDidChangeModelContent(() => {
          setOriginalText(originalEditor.getValue());
        }),
        modifiedEditor.onDidChangeModelContent(() => {
          setModifiedText(modifiedEditor.getValue());
        }),
      ];

      return () => {
        disposables.forEach(d => d.dispose());
      };
    },
    [setOriginalText, setModifiedText],
  );

  useSyncEditorValue(
    useCallback(() => diffEditorRef.current?.getOriginalEditor(), []),
    originalText,
  );

  useSyncEditorValue(
    useCallback(() => diffEditorRef.current?.getModifiedEditor(), []),
    modifiedText,
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
    : [{ label: t('tool.diff.loadingLabel'), value: 'loading' }];

  return (
    <FormControl style={{ width: '100%' }}>
      <Grid container style={{ width: '100%' }}>
        <Grid item style={{ minWidth: '200px' }}>
          <Select
            selected={language}
            onChange={handleLanguageSelect}
            items={languageOptions}
            label={t('tool.diff.selectLanguage')}
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
              buttonText={t('tool.diff.originalFileUploadButton')}
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
              buttonText={t('tool.diff.modifiedFileUploadButton')}
            />
            <ClearValueButton setValue={setModifiedText} />
            <PasteFromClipboardButton setInput={setModifiedText} />
            {modifiedText && <CopyToClipboardButton output={modifiedText} />}
          </ButtonGroup>
        </Grid>
      </Grid>
      <DiffEditor
        height="100vh"
        theme={theme.includes('dark') ? 'vs-dark' : 'vs-light'}
        options={options}
        language={language}
        onMount={onMount}
      />
    </FormControl>
  );
}

export default Diff;
