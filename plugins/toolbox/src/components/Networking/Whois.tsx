import React, { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { toolboxApiRef } from '../../api';
import { useStyles } from '../../utils/hooks';
import { Progress } from '@backstage/core-components';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Whois = () => {
  const [domain, setDomain] = useState('');
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const toolboxApi = useApi(toolboxApiRef);
  const { classes } = useStyles();

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
            label="Domain"
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
            Lookup
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => {
              setDomain('google.com');
            }}
          >
            Example
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
                className={classes.fullWidth}
                value={Object.entries(value as any)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')}
                inputProps={{
                  style: { resize: 'vertical' },
                }}
                style={{ marginBottom: '1rem' }}
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
