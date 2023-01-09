import React from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader, MarkdownContent } from '@backstage/core-components';
import { Typography } from '@material-ui/core';

export const MarkdownPreview = () => {
  const [input, setInput] = React.useState('');

  return (
    <>
      <ContentHeader title="Markdown preview" />
      <DefaultEditor
        input={input}
        setInput={setInput}
        rightContent={
          <>
            <Typography variant="subtitle1">Preview</Typography>
            <MarkdownContent content={input} />
          </>
        }
      />
    </>
  );
};
