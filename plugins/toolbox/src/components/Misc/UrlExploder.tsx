import React, { useEffect, useState } from 'react';
import { useStyles } from '../../utils/hooks';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import { faker } from '@faker-js/faker';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useToolboxTranslation } from '../../hooks';

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
  const { classes } = useStyles();
  const { t } = useToolboxTranslation();

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
        <ClearValueButton setValue={onInput} />
        <PasteFromClipboardButton
          title={t('tool.url-exploder.pasteFromClipboard')}
          setInput={onInput}
        />
        {rawInput && (
          <CopyToClipboardButton
            title={t('tool.url-exploder.copyToClipboard')}
            output={rawInput}
          />
        )}
        <TextField
          label="URL"
          variant="outlined"
          className={classes.fullWidth}
          value={rawInput}
          onChange={e => onInput(e.target.value)}
          style={{ marginTop: '10px', marginBottom: '10px' }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label={t('tool.url-exploder.protocolLabel')}
          className={classes.fullWidth}
          value={protocol}
          style={{ marginBottom: '10px' }}
          onChange={e => setProtocol(e.target.value)}
        />
        <TextField
          label={t('tool.url-exploder.pathLabel')}
          className={classes.fullWidth}
          value={path}
          style={{ marginBottom: '10px' }}
          onChange={e => setPath(e.target.value)}
        />
        <TextField
          label={t('tool.url-exploder.usernameLabel')}
          className={classes.fullWidth}
          value={username}
          style={{ marginBottom: '10px' }}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label={t('tool.url-exploder.queryLabel')}
          className={classes.fullWidth}
          value={query}
          multiline
          minRows={10}
          style={{ marginBottom: '10px' }}
          onChange={e => setQuery(e.target.value)}
          helperText={t('tool.url-exploder.queryHelperText')}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label={t('tool.url-exploder.hostLabel')}
          className={classes.fullWidth}
          value={host}
          style={{ marginBottom: '10px' }}
          onChange={e => setHost(e.target.value)}
        />
        <TextField
          label={t('tool.url-exploder.portLabel')}
          className={classes.fullWidth}
          type="number"
          value={port}
          style={{ marginBottom: '10px' }}
          onChange={e => setPort(e.target.value)}
        />
        <TextField
          label={t('tool.url-exploder.passwordLabel')}
          className={classes.fullWidth}
          value={password}
          style={{ marginBottom: '10px' }}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          label={t('tool.url-exploder.hashLabel')}
          className={classes.fullWidth}
          value={hash}
          style={{ marginBottom: '10px' }}
          onChange={e => setHash(e.target.value)}
        />
        <TextField
          label={t('tool.url-exploder.originLabel')}
          className={classes.fullWidth}
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
