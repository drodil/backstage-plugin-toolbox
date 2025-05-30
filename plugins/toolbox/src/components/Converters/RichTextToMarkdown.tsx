import { useState, useEffect } from 'react';
import TurndownService from 'turndown';
import { DefaultEditor } from '../DefaultEditor';
import { MarkdownContent } from '@backstage/core-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useToolboxTranslation } from '../../hooks';

// this library has no types available
const { gfm } = require('turndown-plugin-gfm') as {
  gfm: TurndownService.Plugin;
};

export const RichTextToMarkdown = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useToolboxTranslation();

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
              sx={{ padding: 2 }}
              style={{ marginTop: '1rem' }}
            >
              <Typography variant="subtitle1">
                {t('tool.rich-text-to-markdown-convert.preview')}:
              </Typography>
              <MarkdownContent content={output} />
            </Paper>
          )}
        </>
      }
    />
  );
};

export default RichTextToMarkdown;
