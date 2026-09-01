import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { faker } from '@faker-js/faker/locale/en';
import { Flex, Text, TextField } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';

const ANALYZED_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 :;,.!?*+^${}()|/\\';

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const StringAnalyzer = () => {
  const [input, setInput] = useState('');
  const [characters, setCharacters] = useState(0);
  const [lines, setLines] = useState(0);
  const [words, setWords] = useState(0);
  const [alphabets, setAlphabets] = useState<{ char: string; count: number }[]>(
    [],
  );
  const { t } = useToolboxTranslation();

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
          <Text variant="title-small">
            {t('tool.string-analyzer.overallStats')}
          </Text>
          <Flex gap="4" style={{ margin: 'var(--bui-space-2) 0' }}>
            <TextField
              label="Characters"
              value={String(characters)}
              onChange={() => {}}
              autoComplete="off"
            />
            <TextField
              label="Lines"
              value={String(lines)}
              onChange={() => {}}
              autoComplete="off"
            />
            <TextField
              label="Words"
              value={String(words)}
              onChange={() => {}}
              autoComplete="off"
            />
          </Flex>
          <Text
            variant="title-small"
            style={{ marginTop: 'var(--bui-space-4)' }}
          >
            {t('tool.string-analyzer.characterStats')}
          </Text>
          <Flex
            gap="2"
            style={{ flexWrap: 'wrap', marginTop: 'var(--bui-space-2)' }}
          >
            {alphabets.map(({ char, count }) => (
              <TextField
                key={char}
                label={char}
                value={String(count)}
                onChange={() => {}}
                autoComplete="off"
              />
            ))}
          </Flex>
        </>
      }
    />
  );
};

export default StringAnalyzer;
