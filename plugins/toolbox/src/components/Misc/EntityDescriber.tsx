import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import React, { useEffect } from 'react';
import { Entity } from '@backstage/catalog-model';
import { ButtonGroup, FormControl, Grid, TextField } from '@material-ui/core';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';
import { useStyles } from '../../utils/hooks';
import YAML from 'yaml';
import { Autocomplete } from '@material-ui/lab';

export const EntityDescriber = () => {
  const catalogApi = useApi(catalogApiRef);
  const styles = useStyles();

  const [entity, setEntity] = React.useState<Entity | null>(null);
  const [output, setOutput] = React.useState('');
  const [availableEntities, setAvailableEntities] = React.useState<
    Entity[] | null
  >([]);
  useEffect(() => {
    catalogApi.getEntities().then(data => {
      if (data) {
        setAvailableEntities(data.items);
      }
    });
  }, [catalogApi]);

  useEffect(() => {
    if (entity) {
      setOutput(YAML.stringify(entity));
    } else {
      setOutput('');
    }
  }, [entity]);

  const getEntityTitle = (ent: Entity) => {
    if (ent.metadata.title) {
      return ent.metadata.title;
    }
    return ent.metadata.name
      .split(/[_.-]+/)
      .map(a => a.charAt(0).toUpperCase() + a.slice(1))
      .join(' ');
  };

  return (
    <FormControl className={styles.fullWidth}>
      <Grid container spacing={4} style={{ marginBottom: '5px' }}>
        <Grid item>
          <ButtonGroup size="small">
            {output && <CopyToClipboardButton output={output} />}
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid container className={styles.fullWidth}>
        <Grid item xs={4} lg={3}>
          <Autocomplete
            className={styles.fullWidth}
            options={availableEntities ?? []}
            getOptionLabel={option => getEntityTitle(option)}
            groupBy={option => option.kind}
            value={entity}
            onChange={(_e, value) => setEntity(value)}
            renderInput={params => (
              <TextField {...params} label="Entity" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={8} lg={9}>
          <TextField
            id="output"
            label="Output"
            value={output || ''}
            className={styles.fullWidth}
            multiline
            minRows={20}
            maxRows={50}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};
export default EntityDescriber;
