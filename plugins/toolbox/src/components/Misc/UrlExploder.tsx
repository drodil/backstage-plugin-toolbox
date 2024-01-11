import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { useStyles } from '../../utils/hooks';
import { SampleButton } from '../Buttons';
import { faker } from '@faker-js/faker';

const UrlExploder = () => {
  const [url, setUrl] = useState<null | URL>(null);
  const [rawInput, setRawInput] = useState('');
  const [protocol, setProtocol] = useState('');
  const [host, setHost] = useState('');
  const [path, setPath] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState('');
  const styles = useStyles();

  const onInput = (value: string) => {
    setRawInput(value);
    try {
      const newUrl = new URL(value);
      setUrl(newUrl);
    } catch (e) {
      // NOOP
    }
  };

  useEffect(() => {
    if (url) {
      setProtocol(url.protocol);
      setHost(url.hostname);
      setPath(url.pathname);
      setUsername(url.username);
      setPort(url.port);
      setPassword(url.password);
      setHash(url.hash);
      setOrigin(url.origin);
      let q = '';
      url.searchParams.forEach((value, key) => {
        q += `${key}=${value}\n`;
      });
      setQuery(q);
    }
  }, [url]);

  useEffect(() => {
    try {
      const newUrl = new URL('http://localhost');
      newUrl.host = host;
      newUrl.protocol = protocol;
      newUrl.pathname = path;
      newUrl.username = username;
      newUrl.port = port;
      newUrl.password = password;
      newUrl.hash = hash;
      const params = new URLSearchParams();
      query.split('\n').forEach(q => {
        const parts = q.split('=');
        if (parts.length === 2) {
          params.append(parts[0], parts[1]);
        }
      });
      newUrl.search = params.toString();
      setOrigin(newUrl.origin);
      setRawInput(newUrl.toString());
    } catch (e) {
      // NOOP
    }
  }, [protocol, host, path, username, port, password, hash, query]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <SampleButton setInput={onInput} sample={faker.internet.url()} />
        <TextField
          label="URL"
          variant="outlined"
          className={styles.fullWidth}
          value={rawInput}
          onChange={e => onInput(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Protocol"
          className={styles.fullWidth}
          value={protocol}
          style={{ marginBottom: '10px' }}
          onChange={e => setProtocol(e.target.value)}
        />
        <TextField
          label="Path"
          className={styles.fullWidth}
          value={path}
          style={{ marginBottom: '10px' }}
          onChange={e => setPath(e.target.value)}
        />
        <TextField
          label="Username"
          className={styles.fullWidth}
          value={username}
          style={{ marginBottom: '10px' }}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label="Query"
          className={styles.fullWidth}
          value={query}
          multiline
          minRows={10}
          style={{ marginBottom: '10px' }}
          onChange={e => setQuery(e.target.value)}
          helperText="Each parameter on it's own row, format is key=value"
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Host"
          className={styles.fullWidth}
          value={host}
          style={{ marginBottom: '10px' }}
          onChange={e => setHost(e.target.value)}
        />
        <TextField
          label="Port"
          className={styles.fullWidth}
          type="number"
          value={port}
          style={{ marginBottom: '10px' }}
          onChange={e => setPort(e.target.value)}
        />
        <TextField
          label="Password"
          className={styles.fullWidth}
          value={password}
          style={{ marginBottom: '10px' }}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          label="Hash"
          className={styles.fullWidth}
          value={hash}
          style={{ marginBottom: '10px' }}
          onChange={e => setHash(e.target.value)}
        />
        <TextField
          label="Origin"
          className={styles.fullWidth}
          value={origin}
          InputProps={{
            readOnly: true,
          }}
          style={{ marginBottom: '10px' }}
        />
      </Grid>
    </Grid>
  );
};

export default UrlExploder;
