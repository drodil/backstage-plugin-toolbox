import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { validate } from '@roadiehq/roadie-backstage-entity-validator';
import { Alert, AlertTitle } from '@material-ui/lab';

export const EntityValidator = () => {
  const [output, setOutput] = React.useState(
    <Alert severity="info">Empty value provided</Alert>,
  );
  const [input, setInput] = React.useState('');
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

  const formatError = (err: Error) => {
    let msg = err.message;
    msg = msg
      .replace(
        /TypeError: Cannot read properties of undefined \(reading 'namespace'\)/,
        "Must have required property: 'metadata' - missingProperty: 'metadata'",
      )
      .replace(/TypeError: (.*)/, '$1')
      .replace(/YAMLException: (.*)/, 'YAML error: $1')
      .replaceAll('|', '<br>');
    return msg;
  };

  useEffect(() => {
    if (!input) {
      setOutput(<Alert severity="info">Empty value provided</Alert>);
      return;
    }

    validate(input, true)
      .then(() => {
        setOutput(
          <Alert severity="success">
            <AlertTitle>Success!</AlertTitle>Entity is valid!
          </Alert>,
        );
      })
      .catch(err => {
        setOutput(
          <Alert severity="error">
            <AlertTitle>Error!</AlertTitle>
            <div dangerouslySetInnerHTML={{ __html: formatError(err) }} />
          </Alert>,
        );
      });
  }, [input]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      sample={sample}
      rightContent={<>{output}</>}
      allowFileUpload
      inputLabel="Entity YAML"
      acceptFileTypes=".yaml,.yml"
      allowFileDownload
      downloadFileName="catalog-info.yaml"
      downloadFileType="application/yaml"
    />
  );
};

export default EntityValidator;
