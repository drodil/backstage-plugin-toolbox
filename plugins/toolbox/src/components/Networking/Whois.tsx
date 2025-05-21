import { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { toolboxApiRef } from '../../api';
import { Progress } from '@backstage/core-components';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useToolboxTranslation } from '../../hooks';

const Whois = () => {
  const [domain, setDomain] = useState('');
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const toolboxApi = useApi(toolboxApiRef);
  const { t } = useToolboxTranslation();

  const lookup = () => {
    setResponse({});
    if (domain) {
      setLoading(true);
      toolboxApi
        .toolJsonRequest('whois', {
          domain,
        })
        .then((data: any) => {
          setLoading(false);
          setResponse(data);
        });
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            label={t('tool.whois.domainInput')}
            variant="outlined"
            style={{ width: '20rem' }}
            value={domain}
            onChange={e => {
              setDomain(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={lookup}>
            {t('tool.whois.lookupButton')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => {
              setDomain('google.com');
            }}
          >
            {t('tool.whois.exampleButton')}
          </Button>
        </Grid>
      </Grid>
      {loading && <Progress />}
      {Object.keys(response).length > 0 && (
        <Grid style={{ marginTop: '1rem' }}>
          {Object.entries(response).map(([key, value]) => {
            return (
              <TextField
                key={key}
                label={key}
                id="output"
                multiline
                value={Object.entries(value as any)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')}
                inputProps={{
                  style: { resize: 'vertical' },
                }}
                style={{ marginBottom: '1rem', width: '100%' }}
                minRows={30}
                variant="outlined"
              />
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default Whois;
