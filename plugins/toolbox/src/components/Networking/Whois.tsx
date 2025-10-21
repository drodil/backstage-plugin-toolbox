import { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { toolboxApiRef } from '../../api';
import { Progress } from '@backstage/core-components';
import { Button, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  textField: {
    width: '20rem',
  },
  resultGrid: {
    marginTop: theme.spacing(2), // 1rem = 16px
  },
  outputTextField: {
    marginBottom: theme.spacing(2), // 1rem = 16px
    width: '100%',
  },
}));

export const Whois = () => {
  const [domain, setDomain] = useState('');
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const toolboxApi = useApi(toolboxApiRef);
  const { t } = useToolboxTranslation();
  const classes = useStyles();

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
            className={classes.textField}
            value={domain}
            onChange={e => {
              setDomain(e.target.value);
            }}
            autoComplete="off"
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
        <Grid className={classes.resultGrid}>
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
                className={classes.outputTextField}
                minRows={30}
                variant="outlined"
                autoComplete="off"
              />
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default Whois;
