import { useEffect, useState } from 'react';
import TurndownService from 'turndown';
import { DefaultEditor } from '../DefaultEditor';
import { MarkdownContent } from '@backstage/core-components';
import { Text } from '@backstage/ui';
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
            <div style={{ marginTop: '1rem' }}>
              <Text variant="body-small">
                {t('tool.rich-text-to-markdown-convert.preview')}:
              </Text>
              <MarkdownContent content={output} />
            </div>
          )}
        </>
      }
    />
  );
};

export default RichTextToMarkdown;
