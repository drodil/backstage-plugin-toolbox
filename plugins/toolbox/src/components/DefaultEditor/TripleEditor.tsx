import { DragEvent, ReactElement, useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  FileUploadButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import { FileDownloadButton } from '../Buttons/FileDownloadButton';
import { Button, Flex } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import styles from './TripleEditor.module.css';

type Props = {
  input: string;
  setInput: (value: string) => void;
  pattern: string;
  setPattern: (value: string) => void;
  output: string;
  setOutput: (value: string) => void;
  mode?: string;
  inputLabel?: string;
  patternLabel?: string;
  outputLabel?: string;
  setMode?: (value: string) => void;
  modes?: Array<string>;
  leftContent?: ReactElement;
  extraLeftContent?: ReactElement;
  middleContent?: ReactElement;
  extraMiddleContent?: ReactElement;
  rightContent?: ReactElement;
  extraRightContent?: ReactElement;
  sample?: string;
  additionalTools?: ReactElement[];
  allowFileUpload?: boolean;
  acceptFileTypes?: string;
  allowFileDownload?: boolean;
  downloadFileType?: string;
  downloadFileName?: string;
  inputProps?: any;
  patternProps?: any;
  outputProps?: any;
};

export const TripleEditor = (props: Props) => {
  const { t } = useToolboxTranslation();
  const {
    input,
    setInput,
    pattern,
    setPattern,
    output,
    setOutput,
    inputLabel = t('components.defaultEditor.inputLabel'),
    patternLabel = t('components.defaultEditor.patternLabel'),
    outputLabel = t('components.defaultEditor.outputLabel'),
    mode,
    setMode,
    modes,
    leftContent,
    extraLeftContent,
    middleContent,
    extraMiddleContent,
    rightContent,
    extraRightContent,
    sample,
    additionalTools,
    allowFileUpload,
    acceptFileTypes,
    allowFileDownload,
    downloadFileName,
    downloadFileType,
  } = props;

  const [fileName, setFileName] = useState(downloadFileName ?? 'output');
  const [fileType, setFileType] = useState(downloadFileType ?? 'txt');

  const readFileAndSetInput = (file?: File) => {
    if (!file) {
      setInput('');
      return;
    }

    setFileName(file.name);
    setFileType(file.type);
    const reader = new FileReader();
    reader.onload = async e => {
      // @ts-ignore
      setInput(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    if (allowFileUpload !== true) {
      return;
    }
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach(item => {
        if (item.kind !== 'file') {
          return;
        }
        const file = item.getAsFile();
        if (file) {
          readFileAndSetInput(file);
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach(file => {
        readFileAndSetInput(file);
      });
    }
  };

  return (
    <div className={styles.container} onDrop={handleDrop}>
      {modes && modes.length > 0 && (
        <Flex gap="2" className={styles.toolsRow}>
          {modes.map(m => (
            <Button
              key={m}
              variant={mode === m ? 'primary' : 'secondary'}
              onClick={() => setMode && setMode(m)}
            >
              {t(`components.defaultEditor.mode.${m.toLowerCase()}`, {
                defaultValue: m,
              })}
            </Button>
          ))}
        </Flex>
      )}
      <Flex gap="2" className={styles.toolsRow}>
        <ClearValueButton setValue={setInput} />
        <PasteFromClipboardButton setInput={setInput} />
        <ClearValueButton setValue={setPattern} />
        <PasteFromClipboardButton setInput={setPattern} />
        {output && <CopyToClipboardButton output={output} />}
        {sample && <SampleButton setInput={setInput} sample={sample} />}
        {allowFileUpload && (
          <FileUploadButton
            accept={acceptFileTypes}
            onFileLoad={readFileAndSetInput}
          />
        )}
        {output && allowFileDownload && (
          <FileDownloadButton
            content={output}
            fileName={fileName}
            fileType={fileType}
          />
        )}
        {additionalTools && additionalTools.map(tool => tool)}
      </Flex>
      <div className={styles.editorsRow}>
        <div className={styles.editorCell}>
          {leftContent ?? (
            <>
              <label htmlFor="input" className={styles.fieldLabel}>
                {inputLabel}
              </label>
              <textarea
                id="input"
                className={styles.textarea}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoComplete="off"
              />
            </>
          )}
          {extraLeftContent}
        </div>
        <div className={styles.editorCell}>
          {middleContent ?? (
            <>
              <label htmlFor="pattern" className={styles.fieldLabel}>
                {patternLabel}
              </label>
              <textarea
                id="pattern"
                className={styles.textarea}
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                autoComplete="off"
              />
            </>
          )}
          {extraMiddleContent}
        </div>
        <div className={styles.editorCell}>
          {rightContent ?? (
            <>
              <label htmlFor="output" className={styles.fieldLabel}>
                {outputLabel}
              </label>
              <textarea
                id="output"
                className={styles.textarea}
                value={output}
                onChange={e => setOutput(e.target.value)}
                autoComplete="off"
              />
            </>
          )}
          {extraRightContent}
        </div>
      </div>
    </div>
  );
};
