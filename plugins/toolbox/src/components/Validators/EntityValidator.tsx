import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { Alert } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import { useApi } from '@backstage/core-plugin-api';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  EntityDocument,
  labelErrors,
  parseEntityDocuments,
  ValidationError,
} from '../../utils/entityDocuments';

type AlertState = {
  status: 'info' | 'danger' | 'success';
  title?: string;
  description: string;
};

const validateDocument =
  (catalogApi: CatalogApi) =>
  (document: EntityDocument): Promise<ValidationError[]> =>
    document.type === 'error'
      ? Promise.resolve([document.error])
      : catalogApi
          .validateEntity(
            document.entity,
            'url:https://localhost/entity-validator',
          )
          .then(resp => (resp.valid ? [] : resp.errors))
          .catch(err => [err]);

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

  const formatError = (err: ValidationError | ValidationError[]) => {
    const msgs = Array.isArray(err) ? err : [err];
    return msgs.map(msg => `${msg.name}: ${msg.message}`).join('\n');
  };

  useEffect(() => {
    const documents = parseEntityDocuments(input);
    if (documents.length === 0) {
      setAlert({
        status: 'info',
        description: t('tool.entity-validator.alertEmptyValue'),
      });
      return undefined;
    }

    let cancelled = false;
    Promise.all(documents.map(validateDocument(catalogApi))).then(results => {
      if (cancelled) {
        return;
      }
      const errors = labelErrors(documents, results);
      const validMessage =
        documents.length === 1
          ? t('tool.entity-validator.alertValidEntity')
          : t('tool.entity-validator.alertValidEntities', {
              count: documents.length,
            });
      setAlert(
        errors.length > 0
          ? {
              status: 'danger',
              title: t('tool.entity-validator.alertErrorTitle'),
              description: formatError(errors),
            }
          : {
              status: 'success',
              title: t('tool.entity-validator.alertSuccessTitle'),
              description: validMessage,
            },
      );
    });
    return () => {
      cancelled = true;
    };
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
