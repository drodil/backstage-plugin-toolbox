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
import { ClearInputButton } from '../Buttons/ClearInputButton';
import { SampleButton } from '../Buttons/SampleButton';

type Props = {
  input: string;
  setInput: (value: string) => void;
  output?: string;
  mode?: string;
  setMode?: (value: string) => void;
  modes?: Array<string>;
  leftContent?: JSX.Element;
  rightContent?: JSX.Element;
  sample?: string;
};

export const DefaultEditor = (props: Props) => {
  const {
    input,
    setInput,
    output,
    mode,
    setMode,
    modes,
    leftContent,
    rightContent,
    sample,
  } = props;
  const styles = useStyles();

  return (
    <FormControl className={styles.fullWidth}>
      <Grid container spacing={4} style={{ marginBottom: '5px' }}>
        {modes && modes.length > 0 && (
          <Grid item>
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
              style={{ marginBottom: '1rem' }}
            >
              {modes.map(m => (
                <Button
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
          <ButtonGroup>
            <ClearInputButton setInput={setInput} />
            <PasteFromClipboardButton setInput={setInput} />
            {output && <CopyToClipboardButton output={output} />}
            {sample && <SampleButton setInput={setInput} sample={sample} />}
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid container className={styles.fullWidth}>
        <Grid item xs={12} lg={6}>
          {leftContent ? (
            leftContent
          ) : (
            <>
              <TextField
                label="Input"
                // eslint-disable-next-line
                autoFocus
                id="input"
                multiline
                className={styles.fullWidth}
                value={input}
                onChange={e => setInput(e.target.value)}
                minRows={20}
                maxRows={50}
                variant="outlined"
              />
            </>
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {rightContent ? (
            rightContent
          ) : (
            <>
              <TextField
                id="output"
                label="Output"
                value={output || ''}
                className={styles.fullWidth}
                multiline
                minRows={20}
                maxRows={50}
                variant="outlined"
              />
            </>
          )}
        </Grid>
      </Grid>
    </FormControl>
  );
};
