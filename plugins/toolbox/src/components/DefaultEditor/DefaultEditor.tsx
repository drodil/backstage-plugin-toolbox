import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  TextField,
} from '@material-ui/core';
import React from 'react';
import { useStyles } from '../../utils/hooks';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';
import { PasteFromClipboardButton } from '../Buttons/PasteFromClipboardButton';
import { ClearValueButton } from '../Buttons/ClearValueButton';
import { SampleButton } from '../Buttons/SampleButton';
import { FileUploadButton } from '../Buttons';
import { FileDownloadButton } from '../Buttons/FileDownloadButton';

type Props = {
  input: string;
  setInput: (value: string) => void;
  output?: string;
  mode?: string;
  minRows?: number;
  inputLabel?: string;
  outputLabel?: string;
  setMode?: (value: string) => void;
  modes?: Array<string>;
  leftContent?: JSX.Element;
  extraLeftContent?: JSX.Element;
  rightContent?: JSX.Element;
  extraRightContent?: JSX.Element;
  sample?: string;
  additionalTools?: JSX.Element[];
  allowFileUpload?: boolean;
  acceptFileTypes?: string;
  allowFileDownload?: boolean;
  downloadFileType?: string;
  downloadFileName?: string;
  inputProps?: any;
  outputProps?: any;
};

export const DefaultEditor = (props: Props) => {
  const {
    input,
    setInput,
    output,
    inputLabel = 'Input',
    outputLabel = 'Output',
    mode,
    setMode,
    modes,
    leftContent,
    extraLeftContent,
    rightContent,
    extraRightContent,
    sample,
    additionalTools,
    allowFileUpload,
    acceptFileTypes,
    allowFileDownload,
    downloadFileName,
    downloadFileType,
    inputProps,
    outputProps,
    minRows = 20,
  } = props;
  const styles = useStyles();

  const [fileName, setFileName] = React.useState(
    downloadFileName ?? 'download.txt',
  );
  const [fileType, setFileType] = React.useState(
    downloadFileType ?? 'text/plain',
  );

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

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
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
    <FormControl className={styles.fullWidth} onDrop={handleDrop}>
      <Grid container spacing={4} style={{ marginBottom: '5px' }}>
        {modes && modes.length > 0 && (
          <Grid item>
            <ButtonGroup
              size="small"
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
              style={{ marginBottom: '1rem' }}
            >
              {modes.map(m => (
                <Button
                  size="small"
                  key={m}
                  onClick={() => setMode && setMode(m)}
                  variant={mode === m ? 'contained' : 'outlined'}
                >
                  {m}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
        )}
        <Grid item>
          <ButtonGroup size="small">
            <ClearValueButton setValue={setInput} />
            <PasteFromClipboardButton setInput={setInput} />
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
          </ButtonGroup>
        </Grid>
        {additionalTools && additionalTools.length > 0 && (
          <Grid item>{additionalTools.map(tool => tool)}</Grid>
        )}
      </Grid>
      <Grid container className={styles.fullWidth}>
        <Grid item xs={12} lg={6}>
          {leftContent ? (
            leftContent
          ) : (
            <>
              <TextField
                label={inputLabel}
                // eslint-disable-next-line
                autoFocus
                id="input"
                multiline
                className={styles.fullWidth}
                value={input}
                onChange={e => setInput(e.target.value)}
                inputProps={{
                  style: { resize: 'vertical' },
                  ...inputProps,
                }}
                minRows={minRows}
                variant="outlined"
              />
            </>
          )}
          {extraLeftContent}
        </Grid>
        <Grid item xs={12} lg={6}>
          {rightContent ? (
            rightContent
          ) : (
            <>
              <TextField
                id="output"
                label={outputLabel}
                value={output || ''}
                className={styles.fullWidth}
                inputProps={{
                  style: { resize: 'vertical' },
                  ...outputProps,
                }}
                multiline
                minRows={minRows}
                variant="outlined"
              />
            </>
          )}
          {extraRightContent}
        </Grid>
      </Grid>
    </FormControl>
  );
};
