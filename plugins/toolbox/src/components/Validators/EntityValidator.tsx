import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader } from '@backstage/core-components';
import { validate } from '@roadiehq/roadie-backstage-entity-validator';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

export const EntityValidator = () => {
  const [output, setOutput] = React.useState(
    <Alert severity="info">Empty value provided</Alert>,
  );
  const [input, setInput] = React.useState('');
  const sample =
    '# Header 1\n\nHello. This is markdown.\n\n* List item 1\n* List item2\n';

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
    <>
      <ContentHeader title="Backstage entity validator">
        <Button
          variant="contained"
          size="small"
          target="_blank"
          href="https://backstage.io/docs/features/software-catalog/descriptor-format"
          startIcon={<DescriptionIcon />}
        >
          Entity descriptor format
        </Button>
      </ContentHeader>
      <DefaultEditor
        input={input}
        setInput={setInput}
        sample={sample}
        rightContent={<>{output}</>}
      />
    </>
  );
};
