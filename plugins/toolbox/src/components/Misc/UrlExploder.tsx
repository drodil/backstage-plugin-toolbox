import { useEffect, useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import { faker } from '@faker-js/faker/locale/en';
import { Flex, TextField } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import styles from '../DefaultEditor/DefaultEditor.module.css';

export const UrlExploder = () => {
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
    <div style={{ width: '100%' }}>
      <Flex gap="2" style={{ marginBottom: 'var(--bui-space-2)' }}>
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
      </Flex>
      <div style={{ marginBottom: 'var(--bui-space-4)' }}>
        <TextField
          label="URL"
          value={rawInput}
          onChange={val => onInput(val)}
          autoComplete="url"
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--bui-space-4)',
        }}
      >
        <div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <TextField
              label={t('tool.url-exploder.protocolLabel')}
              value={protocol}
              onChange={setProtocol}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <TextField
              label={t('tool.url-exploder.pathLabel')}
              value={path}
              onChange={setPath}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <TextField
              label={t('tool.url-exploder.usernameLabel')}
              value={username}
              onChange={setUsername}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <label className={styles.fieldLabel}>
              {t('tool.url-exploder.queryLabel')}
            </label>
            <textarea
              className={styles.textarea}
              rows={10}
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <TextField
              label={t('tool.url-exploder.hostLabel')}
              value={host}
              onChange={setHost}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <label
              style={{
                fontSize: 'var(--bui-font-size-1)',
                color: 'var(--bui-fg-secondary)',
                display: 'block',
                marginBottom: 'var(--bui-space-1)',
              }}
            >
              {t('tool.url-exploder.portLabel')}
            </label>
            <input
              type="number"
              value={port}
              onChange={e => setPort(e.target.value)}
              autoComplete="off"
              style={{
                padding: 'var(--bui-space-2)',
                border: '1px solid var(--bui-border-1)',
                borderRadius: 'var(--bui-radius-2)',
                fontFamily: 'var(--bui-font-regular)',
                fontSize: 'var(--bui-font-size-2)',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <TextField
              label={t('tool.url-exploder.passwordLabel')}
              value={password}
              onChange={setPassword}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <TextField
              label={t('tool.url-exploder.hashLabel')}
              value={hash}
              onChange={setHash}
              autoComplete="off"
            />
          </div>
          <div style={{ marginBottom: 'var(--bui-space-2)' }}>
            <TextField
              label={t('tool.url-exploder.originLabel')}
              value={origin}
              onChange={() => {}}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlExploder;
