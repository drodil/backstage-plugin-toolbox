import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { Alert } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import YAML from 'yaml';
import { Entity } from '@backstage/catalog-model';

type AnyError = { name: string; message: string };
type AlertState = {
  status: 'info' | 'danger' | 'success';
  title?: string;
  description: string;
};

export const EntityValidator = () => {
  const { t } = useToolboxTranslation();
  const [alert, setAlert] = useState<AlertState>({
    status: 'info',
    description: '',
  });
  const [input, setInput] = useState('');
  const catalogApi = useApi(catalogApiRef);
  const sample =
    'apiVersion: backstage.io/v1alpha1\n' +
    'kind: Component\n' +
    'metadata:\n' +
    '  name: artist-web\n' +
    '  description: The place to be, for great artists\n' +
    '  labels:\n' +
    '    example.com/custom: custom_label_value\n' +
    '  annotations:\n' +
    '    example.com/service-discovery: artistweb\n' +
    '    circleci.com/project-slug: github/example-org/artist-website\n' +
    '  tags:\n' +
    '    - java\n' +
    '  links:\n' +
    '    - url: https://admin.example-org.com\n' +
    '      title: Admin Dashboard\n' +
    '      icon: dashboard\n' +
    '      type: admin-dashboard\n' +
    'spec:\n' +
    '  type: website\n' +
    '  lifecycle: production\n' +
    '  owner: artist-relations-team\n' +
    '  system: public-websites';

  const formatError = (err: AnyError | AnyError[]) => {
    const msgs = Array.isArray(err) ? err : [err];
    return msgs.map(msg => `${msg.name}: ${msg.message}`).join('\n');
  };

  useEffect(() => {
    if (!input) {
      setAlert({
        status: 'info',
        description: t('tool.entity-validator.alertEmptyValue'),
      });
      return;
    }

    let entity;
    try {
      entity = YAML.parse(input);
    } catch (err) {
      setAlert({
        status: 'danger',
        title: t('tool.entity-validator.alertErrorTitle'),
        description: formatError(err),
      });
      return;
    }
    catalogApi
      .validateEntity(
        entity as Entity,
        'url:https://localhost/entity-validator',
      )
      .then(resp => {
        if (resp.valid) {
          setAlert({
            status: 'success',
            title: t('tool.entity-validator.alertSuccessTitle'),
            description: t('tool.entity-validator.alertValidEntity'),
          });
          return;
        }
        setAlert({
          status: 'danger',
          title: t('tool.entity-validator.alertErrorTitle'),
          description: formatError(resp.errors),
        });
      })
      .catch(err => {
        setAlert({
          status: 'danger',
          title: t('tool.entity-validator.alertErrorTitle'),
          description: formatError(err),
        });
      });
  }, [catalogApi, input, t]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      sample={sample}
      rightContent={
        <Alert
          status={alert.status}
          title={alert.title}
          description={alert.description}
        />
      }
      allowFileUpload
      inputLabel={t('tool.entity-validator.inputLabel')}
      acceptFileTypes=".yaml,.yml"
      allowFileDownload
      downloadFileName="catalog-info.yaml"
      downloadFileType="application/yaml"
    />
  );
};

export default EntityValidator;
