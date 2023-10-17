import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';
import TurndownService from 'turndown';
import { useStyles } from '../../utils/hooks';

import { MarkdownContent } from '@backstage/core-components';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { CopyToClipboardButton } from '../Buttons';

// this library has no types available
const { gfm } = require('turndown-plugin-gfm') as {
  gfm: TurndownService.Plugin;
};

export const RichTextToMarkdown = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState('');
  const [output, setOutput] = React.useState('');

  const pasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();

      // we'll take the first applicable item, prefering text/html
      const item =
        items.find(i => i.types.includes('text/html')) ||
        items.find(i => i.types.includes('text/plain'));

      if (item) {
        const isHtml = item.types.includes('text/html');
        const content = await item
          .getType(isHtml ? 'text/html' : 'text/plain')
          .then(blob => blob.text());
        setInput(isHtml ? content : `<pre><code>${content}</code></pre>`);
        setError('');
      } else {
        const contentTypes = items
          .map(i => i.types)
          .flat()
          .join(', ');
        setInput('');
        setError(
          `Clipboard did not contain any <code>text/html</code> or <code>text/plain</code> content (content was <code>${contentTypes})`,
        );
      }
    } catch (err) {
      setError(
        `Error reading/converting data from clipboard: ${err.message || err}`,
      );
    }
  };

  useEffect(() => {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    turndownService.use(gfm);
    setOutput(turndownService.turndown(input));
    window.addEventListener('paste', pasteFromClipboard);
    return () => {
      window.removeEventListener('paste', pasteFromClipboard);
    };
  }, [input]);

  return (
    <Grid container className={styles.fullWidth}>
      <Grid item xs={12} lg={3}>
        <Typography>
          Copy rich text content to the clipboard and then paste on this page
          (or click the button below) to convert to Markdown.
        </Typography>
        <br />
        <Tooltip arrow title="Convert clipboard contents to markdown">
          <Button
            size="large"
            fullWidth
            startIcon={<AssignmentReturnedIcon />}
            onClick={pasteFromClipboard}
          >
            Convert to markdown
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Box display="flex" justifyContent="right">
          <ButtonGroup size="small">
            <CopyToClipboardButton output={output} />
          </ButtonGroup>
        </Box>
        <TextField
          id="output"
          label="Markdown"
          value={output || ''}
          className={styles.fullWidth}
          multiline
          minRows={20}
          maxRows={50}
          variant="outlined"
        />
        <Typography color="error">{error}</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Rendered Preview</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={0} className={styles.previewPaper}>
              <MarkdownContent content={output} />
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default RichTextToMarkdown;
