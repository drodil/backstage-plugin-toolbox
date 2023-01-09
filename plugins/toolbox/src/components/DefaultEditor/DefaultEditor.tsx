import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useStyles } from '../../utils/hooks';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';
import { PasteFromClipboardButton } from '../Buttons/PasteFromClipboardButton';
import { ClearInputButton } from '../Buttons/ClearInputButton';

type Props = {
  input: string;
  setInput: (value: string) => void;
  output: string;
  mode: string;
  setMode: (value: string) => void;
  modes: Array<string>;
};

export const DefaultEditor = (props: Props) => {
  const { input, setInput, output, mode, setMode, modes } = props;
  const styles = useStyles();

  return (
    <FormControl className={styles.fullWidth}>
      <Grid container spacing={4}>
        <Grid item>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
            style={{ marginBottom: '1rem' }}
          >
            {modes.map(m => (
              <Button
                onClick={() => setMode(m)}
                variant={mode === m ? 'contained' : 'outlined'}
              >
                {m}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
        <Grid item>
          <ButtonGroup>
            <ClearInputButton setInput={setInput} />
            <PasteFromClipboardButton setInput={setInput} />
            <CopyToClipboardButton output={output} />
          </ButtonGroup>
        </Grid>
      </Grid>
      <Typography variant="subtitle1">Input</Typography>
      <TextField
        id="input"
        multiline
        value={input}
        onChange={e => setInput(e.target.value)}
        minRows={20}
        variant="outlined"
      />
      <Typography variant="subtitle1">Output</Typography>
      <TextField
        id="output"
        value={output}
        multiline
        minRows={20}
        variant="outlined"
      />
    </FormControl>
  );
};
