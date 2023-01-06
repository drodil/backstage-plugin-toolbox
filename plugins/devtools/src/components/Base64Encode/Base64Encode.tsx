import {
  Button,
  ButtonGroup,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useStyles } from '../../utils/hooks';

export const Base64Encode = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('encode');
  const styles = useStyles();

  useEffect(() => {
    if (mode === 'encode') {
      setOutput(Buffer.from(input).toString('base64'));
    } else {
      setOutput(Buffer.from(input, 'base64').toString());
    }
  }, [input, mode]);

  return (
    <FormControl className={styles.fullWidth}>
      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="Disabled elevation buttons"
        style={{ marginBottom: '1rem' }}
      >
        <Button
          onClick={() => setMode('encode')}
          variant={mode === 'encode' ? 'contained' : 'outlined'}
        >
          Encode
        </Button>
        <Button
          onClick={() => setMode('decode')}
          variant={mode === 'decode' ? 'contained' : 'outlined'}
        >
          Decode
        </Button>
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
