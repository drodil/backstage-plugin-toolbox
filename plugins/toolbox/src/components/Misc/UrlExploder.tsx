import { useEffect, useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import { faker } from '@faker-js/faker';
import { Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  textField: {
    marginBottom: theme.spacing(1.25), // 10px
    width: '100%',
  },
  firstTextField: {
    marginTop: theme.spacing(1.25), // 10px
    marginBottom: theme.spacing(1.25), // 10px
    width: '100%',
  },
}));

export const UrlExploder = () => {
  const classes = useStyles();
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
          value={rawInput}
          onChange={e => onInput(e.target.value)}
          className={classes.firstTextField}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label={t('tool.url-exploder.protocolLabel')}
          value={protocol}
          className={classes.textField}
          onChange={e => setProtocol(e.target.value)}
          variant="outlined"
        />
        <TextField
          label={t('tool.url-exploder.pathLabel')}
          value={path}
          className={classes.textField}
          onChange={e => setPath(e.target.value)}
          variant="outlined"
        />
        <TextField
          label={t('tool.url-exploder.usernameLabel')}
          value={username}
          className={classes.textField}
          onChange={e => setUsername(e.target.value)}
          variant="outlined"
        />
        <TextField
          label={t('tool.url-exploder.queryLabel')}
          value={query}
          multiline
          minRows={10}
          className={classes.textField}
          onChange={e => setQuery(e.target.value)}
          helperText={t('tool.url-exploder.queryHelperText')}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label={t('tool.url-exploder.hostLabel')}
          value={host}
          className={classes.textField}
          onChange={e => setHost(e.target.value)}
          variant="outlined"
        />
        <TextField
          label={t('tool.url-exploder.portLabel')}
          type="number"
          value={port}
          className={classes.textField}
          onChange={e => setPort(e.target.value)}
          variant="outlined"
        />
        <TextField
          label={t('tool.url-exploder.passwordLabel')}
          value={password}
          className={classes.textField}
          onChange={e => setPassword(e.target.value)}
          variant="outlined"
        />
        <TextField
          label={t('tool.url-exploder.hashLabel')}
          value={hash}
          className={classes.textField}
          onChange={e => setHash(e.target.value)}
          variant="outlined"
        />
        <TextField
          label={t('tool.url-exploder.originLabel')}
          value={origin}
          InputProps={{
            readOnly: true,
          }}
          className={classes.textField}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

export default UrlExploder;
