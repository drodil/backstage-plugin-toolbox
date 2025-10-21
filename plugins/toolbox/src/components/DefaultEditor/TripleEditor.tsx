import { ReactElement, useState } from 'react';
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
  buttonGroup: {
    marginBottom: theme.spacing(1),
  },
  toolsGrid: {
    padding: theme.spacing(2), // 16px
  },
  selectedButton: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.selected,
  },
  unselectedButton: {
    borderColor: theme.palette.divider,
  },
  editorGrid: {
    paddingTop: theme.spacing(1), // 8px
    paddingLeft: theme.spacing(1), // 8px
  },
  textField: {
    width: '100%',
    padding: theme.spacing(1), // 8px
  },
}));

type Props = {
  input: string;
  setInput: (value: string) => void;
  pattern: string;
  setPattern: (value: string) => void;
  output: string;
  setOutput: (value: string) => void;
  mode?: string;
  minRows?: number;
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
  const classes = useStyles();
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
    minRows = 20,
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
          </ButtonGroup>
        </Grid>
        {additionalTools && additionalTools.length > 0 && (
          <Grid item>{additionalTools.map(tool => tool)}</Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={12} lg={4} className={classes.editorGrid}>
          {leftContent ? (
            leftContent
          ) : (
            <>
              <TextField
                label={inputLabel}
                // eslint-disable-next-line
                id="input"
                multiline
                value={input}
                onChange={e => setInput(e.target.value)}
                minRows={minRows}
                variant="outlined"
                autoComplete="off"
                className={classes.textField}
              />
            </>
          )}
          {extraLeftContent}
        </Grid>
        <Grid item xs={12} lg={4} className={classes.editorGrid}>
          {middleContent ? (
            middleContent
          ) : (
            <>
              <TextField
                label={patternLabel}
                // eslint-disable-next-line
                id="pattern"
                multiline
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                minRows={minRows}
                variant="outlined"
                autoComplete="off"
                className={classes.textField}
              />
            </>
          )}
          {extraMiddleContent}
        </Grid>
        <Grid item xs={12} lg={4} className={classes.editorGrid}>
          {rightContent ? (
            rightContent
          ) : (
            <>
              <TextField
                label={outputLabel}
                // eslint-disable-next-line
                id="output"
                multiline
                value={output}
                autoComplete="off"
                onChange={e => setOutput(e.target.value)}
                minRows={minRows}
                variant="outlined"
                className={classes.textField}
              />
            </>
          )}
          {extraRightContent}
        </Grid>
      </Grid>
    </FormControl>
  );
};
