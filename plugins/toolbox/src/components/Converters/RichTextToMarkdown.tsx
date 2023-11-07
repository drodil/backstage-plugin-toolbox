import React, { useEffect } from 'react';
import TurndownService from 'turndown';
import { DefaultEditor } from '../DefaultEditor';
import { MarkdownContent } from '@backstage/core-components';
import { Paper, Typography } from '@material-ui/core';
import { useStyles } from '../../utils/hooks';

// this library has no types available
const { gfm } = require('turndown-plugin-gfm') as {
  gfm: TurndownService.Plugin;
};

export const RichTextToMarkdown = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const sample = '<h1>Hello world</h1><p>This is some content</p>';

  useEffect(() => {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    turndownService.use(gfm);
    setOutput(turndownService.turndown(input));
  }, [input]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      output={output}
      sample={sample}
      allowFileUpload
      acceptFileTypes=".html,.htm,.txt"
      allowFileDownload
      downloadFileName="download.md"
      downloadFileType="text/markdown"
      extraRightContent={
        <>
          {output && (
            <Paper
              elevation={0}
              className={styles.previewPaper}
              style={{ marginTop: '1rem' }}
            >
              <Typography variant="subtitle1">Preview:</Typography>
              <MarkdownContent content={output} />
            </Paper>
          )}
        </>
      }
    />
  );
};

export default RichTextToMarkdown;
