import {
  Button,
  ButtonGroup,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useStyles } from '../../utils/hooks';

type Props = {
  input: string;
  setInput: (value: string) => void;
  output: string;
  mode: string;
  setMode: (value: string) => void;
  modes: Array<string>;
};

export const VerticalConverter = (props: Props) => {
  const { input, setInput, output, mode, setMode, modes } = props;
  const styles = useStyles();

  return (
    <FormControl className={styles.fullWidth}>
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
