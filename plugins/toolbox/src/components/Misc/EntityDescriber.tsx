import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { ComponentType, HTMLAttributes, useEffect, useState } from 'react';
import { Entity } from '@backstage/catalog-model';
import { CopyToClipboardButton } from '../Buttons';
import YAML from 'yaml';
import { FileDownloadButton } from '../Buttons/FileDownloadButton';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useToolboxTranslation } from '../../hooks';
import { AutocompleteListboxComponent } from './AutocompleteListComponent.tsx';

export const EntityDescriber = () => {
  const catalogApi = useApi(catalogApiRef);

  const [entity, setEntity] = useState<Entity | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableEntities, setAvailableEntities] = useState<Entity[] | null>(
    [],
  );
  const { t } = useToolboxTranslation();
  useEffect(() => {
    catalogApi.getEntities().then(data => {
      setLoading(false);
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
    <FormControl style={{ width: '100%' }}>
      <Grid container spacing={4} style={{ marginBottom: '5px' }}>
        <Grid item>
          <ButtonGroup size="small">
            {output && <CopyToClipboardButton output={output} />}
            {output && (
              <FileDownloadButton
                content={output}
                fileName="catalog-info.yaml"
                fileType="catalog-info.yaml"
              />
            )}
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid container style={{ width: '100%' }}>
        <Grid item xs={4} lg={3}>
          <Autocomplete
            style={{ width: '100%' }}
            options={availableEntities ?? []}
            ListboxComponent={
              AutocompleteListboxComponent as ComponentType<
                HTMLAttributes<HTMLElement>
              >
            }
            loading={loading}
            getOptionLabel={option => getEntityTitle(option)}
            groupBy={option => option.kind}
            value={entity}
            onChange={(_e, value) => setEntity(value)}
            renderInput={params => (
              <TextField
                {...params}
                label={t('tool.entity-describer.entityLabel')}
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={8} lg={9}>
          <TextField
            id="output"
            label={t('tool.entity-describer.outputLabel')}
            value={output || ''}
            style={{ width: '100%' }}
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
