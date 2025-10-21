import { DragEvent, ReactElement, useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  FileUploadButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import { FileDownloadButton } from '../Buttons/FileDownloadButton';
import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  formControl: {
    width: '100%',
  },
  gridContainer: {
    marginBottom: theme.spacing(0.625), // 5px
  },
  modeGrid: {
    paddingLeft: theme.spacing(2), // 16px
    paddingTop: theme.spacing(4), // 32px
  },
  buttonGroup: {},
  selectedButton: {},
  unselectedButton: {
    borderColor: theme.palette.action.active,
  },
  toolsGrid: {
    padding: theme.spacing(2), // 16px
    marginBottom: theme.spacing(1),
  },
  editorGrid: {
    paddingTop: theme.spacing(1), // 8px
    paddingLeft: theme.spacing(1), // 8px
  },
  outputGrid: {
    paddingTop: theme.spacing(1), // 8px
  },
  textField: {
    width: '100%',
  },
}));

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
  const classes = useStyles();
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
    <FormControl className={classes.formControl} onDrop={handleDrop}>
      <Grid container spacing={4} className={classes.gridContainer}>
        {modes && modes.length > 0 && (
          <Grid item className={classes.modeGrid}>
            <ButtonGroup
              size="small"
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
              className={classes.buttonGroup}
              color="inherit"
            >
              {modes.map(m => (
                <Button
                  size="small"
                  key={m}
                  onClick={() => setMode && setMode(m)}
                  variant={mode === m ? 'contained' : 'outlined'}
                  color="inherit"
                  className={
                    mode === m
                      ? classes.selectedButton
                      : classes.unselectedButton
                  }
                >
                  {t(`components.defaultEditor.mode.${m.toLowerCase()}`, {
                    defaultValue: m,
                  })}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
        )}
        <Grid item className={classes.toolsGrid}>
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
        <Grid item xs={12} lg={6} className={classes.editorGrid}>
          {leftContent ?? (
            <TextField
              label={inputLabel}
              // eslint-disable-next-line
              id="input"
              multiline
              value={input}
              onChange={e => setInput(e.target.value)}
              minRows={minRows}
              variant="outlined"
              className={classes.textField}
              autoComplete="off"
            />
          )}
          {extraLeftContent}
        </Grid>
        <Grid item xs={12} lg={6} className={classes.outputGrid}>
          {rightContent ?? (
            <TextField
              id="output"
              label={outputLabel}
              value={output || ''}
              className={classes.textField}
              multiline
              minRows={minRows}
              variant="outlined"
              autoComplete="off"
            />
          )}
          {extraRightContent}
        </Grid>
      </Grid>
    </FormControl>
  );
};
