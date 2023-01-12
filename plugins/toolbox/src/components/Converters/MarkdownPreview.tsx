import React from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { ContentHeader, MarkdownContent } from '@backstage/core-components';
import { Paper } from '@material-ui/core';
import { useStyles } from '../../utils/hooks';

export const MarkdownPreview = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState('');
  const sample =
    '# Header 1\n\nHello. This is markdown.\n\n* List item 1\n* List item2\n';

  return (
    <>
      <ContentHeader title="Markdown preview" />
      <DefaultEditor
        input={input}
        setInput={setInput}
        sample={sample}
        rightContent={
          <>
            <Paper elevation={0} className={styles.previewPaper}>
              <MarkdownContent content={input} />
            </Paper>
          </>
        }
      />
    </>
  );
};

export default MarkdownPreview;
