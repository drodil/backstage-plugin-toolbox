import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { faker } from '@faker-js/faker';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const ANALYZED_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 :;,.!?*+^${}()|/\\';
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const StringAnalyzer = () => {
  const [input, setInput] = React.useState('');
  const [characters, setCharacters] = React.useState(0);
  const [lines, setLines] = React.useState(0);
  const [words, setWords] = React.useState(0);
  const [alphabets, setAlphabets] = React.useState<
    { char: string; count: number }[]
  >([]);

  useEffect(() => {
    setCharacters(input.length);
    setLines(input ? input.split(/\r\n|\r|\n/g).length : 0);
    setWords(input ? input.split(/\s+/).length : 0);
    const charCounts = [];
    let totalCount = 0;
    for (const char of ANALYZED_CHARS) {
      const count = input.split(new RegExp(escapeRegex(char), 'gi')).length - 1;
      totalCount += count;
      charCounts.push({ char: char === ' ' ? 'Whitespace' : char, count });
    }
    charCounts.push({ char: 'Others', count: input.length - totalCount });
    setAlphabets(charCounts);
  }, [input]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      allowFileUpload
      acceptFileTypes=".json,.csv,.txt,.html,.xml,.yaml,.yml,.log,.md,.markdown,.js,.ts,.c,.cpp,.java,.py,.rb,.php,.sh,.bat"
      sample={faker.lorem.paragraphs(Math.random() * 10 + 1, '\n')}
      rightContent={
        <>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">Overall stats</Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Characters"
                value={characters}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <TextField label="Lines" value={lines} variant="standard" />
            </Grid>
            <Grid item>
              <TextField label="Words" value={words} variant="standard" />
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: '1rem' }}>
            <Grid item xs={12}>
              <Typography variant="h6">Character stats</Typography>
            </Grid>
            {alphabets.map(({ char, count }) => (
              <Grid item key={char}>
                <TextField
                  label={char}
                  value={count}
                  size="small"
                  variant="standard"
                />
              </Grid>
            ))}
          </Grid>
        </>
      }
    />
  );
};

export default StringAnalyzer;
