import { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { toolboxApiRef } from '../../api';
import { Progress } from '@backstage/core-components';
import { Button, Flex, TextField } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import styles from '../DefaultEditor/DefaultEditor.module.css';

export const Whois = () => {
  const [domain, setDomain] = useState('');
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const toolboxApi = useApi(toolboxApiRef);
  const { t } = useToolboxTranslation();

  const lookup = () => {
    setResponse({});
    if (domain) {
      setLoading(true);
      toolboxApi.toolJsonRequest('whois', { domain }).then((data: any) => {
        setLoading(false);
        setResponse(data);
      });
    }
  };

  return (
    <>
      <Flex
        gap="2"
        align="center"
        style={{ marginBottom: 'var(--bui-space-4)' }}
      >
        <TextField
          label={t('tool.whois.domainInput')}
          value={domain}
          onChange={setDomain}
          autoComplete="off"
        />
        <Button variant="primary" onClick={lookup}>
          {t('tool.whois.lookupButton')}
        </Button>
        <Button variant="secondary" onClick={() => setDomain('google.com')}>
          {t('tool.whois.exampleButton')}
        </Button>
      </Flex>
      {loading && <Progress />}
      {Object.keys(response).length > 0 && (
        <div style={{ marginTop: 'var(--bui-space-4)' }}>
          {Object.entries(response).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 'var(--bui-space-2)' }}>
              <label className={styles.fieldLabel}>{key}</label>
              <textarea
                className={styles.textarea}
                readOnly
                rows={5}
                value={Object.entries(value as any)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')}
                autoComplete="off"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Whois;
