import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { MarkdownContent } from '@backstage/core-components';
import beautify from 'js-beautify';
import { unescape } from 'lodash';
import Paper from '@mui/material/Paper';

export const MarkdownPreview = () => {
  const [input, setInput] = React.useState('');
  const [html, setHtml] = React.useState('');
  const sample =
    '# Header 1\n\nHello. This is markdown.\n\n* List item 1\n* List item2\n';

  useEffect(() => {
    const preview = document.getElementsByClassName('mdPreview').item(0);
    if (preview) {
      setHtml(unescape(beautify.html_beautify(preview.innerHTML)));
    }
  }, [input]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      inputLabel="Markdown"
      sample={sample}
      allowFileUpload
      acceptFileTypes=".md"
      rightContent={
        <>
          <Paper elevation={0} sx={{ padding: 2 }}>
            <MarkdownContent className="mdPreview" content={input} />
          </Paper>
          <Paper
            elevation={0}
            sx={{ padding: 2 }}
            style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}
          >
            {html}
          </Paper>
        </>
      }
    />
  );
};

export default MarkdownPreview;
