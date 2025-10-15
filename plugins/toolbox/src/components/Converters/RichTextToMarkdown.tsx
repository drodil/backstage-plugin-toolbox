import { useEffect, useState } from 'react';
import TurndownService from 'turndown';
import { DefaultEditor } from '../DefaultEditor';
import { MarkdownContent } from '@backstage/core-components';
import { makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  paper: {
    marginTop: theme.spacing(2), // 1rem = 16px
  },
}));

// this library has no types available
const { gfm } = require('turndown-plugin-gfm') as {
  gfm: TurndownService.Plugin;
};

export const RichTextToMarkdown = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useToolboxTranslation();
  const classes = useStyles();

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
            <Paper elevation={0} className={classes.paper}>
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
