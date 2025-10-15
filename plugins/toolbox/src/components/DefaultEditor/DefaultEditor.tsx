import { DragEvent, ReactElement, useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  FileUploadButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import { FileDownloadButton } from '../Buttons/FileDownloadButton';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { useToolboxTranslation } from '../../hooks';
import { useDebounce } from 'react-use';

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
  leftContent?: ReactElement;
  extraLeftContent?: ReactElement;
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
  outputProps?: any;
};

export const DefaultEditor = (props: Props) => {
  const { t } = useToolboxTranslation();
  const {
    input,
    setInput,
    output,
    inputLabel = t('components.defaultEditor.inputLabel'),
    outputLabel = t('components.defaultEditor.outputLabel'),
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
    minRows = 20,
  } = props;

  const [fileName, setFileName] = useState(downloadFileName ?? 'download.txt');
  const [fileType, setFileType] = useState(downloadFileType ?? 'text/plain');
  const [writtenInput, setWrittenInput] = useState(input);

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

  useDebounce(
    () => {
      setInput(writtenInput);
    },
    150,
    [writtenInput],
  );

  return (
    <FormControl style={{ width: '100%' }} onDrop={handleDrop}>
      <Grid container spacing={4} style={{ marginBottom: '5px' }}>
        {modes && modes.length > 0 && (
          <Grid item sx={{ pl: '16px', pt: '32px !important' }}>
            <ButtonGroup
              size="small"
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
              style={{ marginBottom: '1rem' }}
              color="inherit"
            >
              {modes.map(m => (
                <Button
                  size="small"
                  key={m}
                  onClick={() => setMode && setMode(m)}
                  variant={mode === m ? 'contained' : 'outlined'}
                  color="inherit"
                  sx={{
                    ...(mode === m && {
                      color: '#000000',
                      backgroundColor: '#E0E0E0',
                    }),
                    ...(mode !== m && {
                      borderColor: '#E0E0E0',
                    }),
                  }}
                >
                  {t(`components.defaultEditor.mode.${m.toLowerCase()}`, {
                    defaultValue: m,
                  })}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
        )}
        <Grid item sx={{ p: '16px' }}>
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
      <Grid container>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{ pt: '8px !important', pl: '8px !important' }}
        >
          {leftContent ?? (
            <TextField
              label={inputLabel}
              // eslint-disable-next-line
              id="input"
              multiline
              value={writtenInput}
              onChange={e => setWrittenInput(e.target.value)}
              minRows={minRows}
              variant="outlined"
              sx={{
                width: '100%',
                p: '8px',
                '& label[class*="MuiFormLabel-root"]': {
                  paddingTop: '10px !important',
                  paddingLeft: '10px !important',
                },
              }}
            />
          )}
          {extraLeftContent}
        </Grid>
        <Grid item xs={12} lg={6} sx={{ p: '8px !important', mt: '8px' }}>
          {rightContent ?? (
            <TextField
              id="output"
              label={outputLabel}
              value={output || ''}
              style={{ width: '100%' }}
              multiline
              minRows={minRows}
              variant="outlined"
            />
          )}
          {extraRightContent}
        </Grid>
      </Grid>
    </FormControl>
  );
};
