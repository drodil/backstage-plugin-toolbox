import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useToolboxTranslation } from '../../hooks';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import YAML from 'yaml';
import { Entity } from '@backstage/catalog-model';

type AnyError = { name: string; message: string };

export const EntityValidator = () => {
  const { t } = useToolboxTranslation();
  const [output, setOutput] = useState(
    <Alert severity="info">{t('tool.entity-validator.alertEmptyValue')}</Alert>,
  );
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
    return msgs
      .map(msg => `${msg.name}: ${msg.message.replaceAll('|', '<br>')}`)
      .join('<hr><br>');
  };

  useEffect(() => {
    if (!input) {
      setOutput(
        <Alert severity="info">
          {t('tool.entity-validator.alertEmptyValue')}
        </Alert>,
      );
      return;
    }

    let entity;
    try {
      entity = YAML.parse(input);
    } catch (err) {
      setOutput(
        <Alert severity="error">
          <AlertTitle>{t('tool.entity-validator.alertErrorTitle')}</AlertTitle>
          <div dangerouslySetInnerHTML={{ __html: formatError(err) }} />
        </Alert>,
      );
      return;
    }
    catalogApi
      .validateEntity(
        entity as Entity,
        'url:https://localhost/entity-validator',
      )
      .then(resp => {
        if (resp.valid) {
          setOutput(
            <Alert severity="success">
              <AlertTitle>
                {t('tool.entity-validator.alertSuccessTitle')}
              </AlertTitle>
              {t('tool.entity-validator.alertValidEntity')}
            </Alert>,
          );
          return;
        }
        setOutput(
          <Alert severity="error">
            <AlertTitle>
              {t('tool.entity-validator.alertErrorTitle')}
            </AlertTitle>
            <div
              dangerouslySetInnerHTML={{ __html: formatError(resp.errors) }}
            />
          </Alert>,
        );
      })
      .catch(err => {
        setOutput(
          <Alert severity="error">
            <AlertTitle>
              {t('tool.entity-validator.alertErrorTitle')}
            </AlertTitle>
            <div dangerouslySetInnerHTML={{ __html: formatError(err) }} />
          </Alert>,
        );
      });
  }, [catalogApi, input, t]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      sample={sample}
      rightContent={<>{output}</>}
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
