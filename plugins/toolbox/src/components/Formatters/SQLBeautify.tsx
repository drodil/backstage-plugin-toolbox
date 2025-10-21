import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { DefaultEditor } from '../DefaultEditor';
import { format } from 'sql-formatter';
import { useToolboxTranslation } from '../../hooks';
import { SQLLanguageSelector } from './SQLLanguageSelector';

const languages = [
  'sql',
  'bigquery',
  'db2',
  'db2i',
  'hive',
  'mariadb',
  'mysql',
  'n1ql',
  'plsql',
  'postgresql',
  'redshift',
  'singlestoredb',
  'snowflake',
  'spark',
  'sqlite',
  'transactsql',
  'trino',
];

const useStyles = makeStyles({
  textField: {
    zIndex: 0,
    width: '100%',
  },
});

/**
 * SQLBeautify - Formats SQL queries using sql-formatter.
 * Allows selection of SQL language.
 */
export const SQLBeautify = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('sql');
  const { t } = useToolboxTranslation();

  const sample = "SELECT bar, foo FROM foo_bar WHERE foo='bar' GROUP BY bar";
  const classes = useStyles();
  useEffect(() => {
    if (input) {
      try {
        setOutput(format(input, { language }));
      } catch (e) {
        if (e instanceof Error && e.message) {
          setOutput(e.message);
        } else {
          setOutput(
            t('tool.format-sql.unexpectedError', {
              defaultValue: 'An unexpected error occurred',
            }),
          );
        }
      }
    } else {
      setOutput('');
    }
  }, [input, language, t]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      output={output}
      sample={sample}
      allowFileUpload
      acceptFileTypes=".sql"
      inputLabel={t('tool.format-sql.inputLabel')}
      outputLabel={t('tool.format-sql.outputLabel')}
      allowFileDownload
      downloadFileName="download.sql"
      downloadFileType="text/plain"
      additionalTools={[
        <SQLLanguageSelector
          key="sqlLanguageSelector"
          language={language}
          onChange={setLanguage}
          languages={languages}
        />,
      ]}
      leftContent={
        <TextField
          name="editorSqlInput_abc1234"
          label={t('tool.format-sql.inputLabel')}
          id="input"
          multiline
          value={input}
          onChange={e => setInput(e.target.value)}
          minRows={20}
          variant="outlined"
          inputProps={{
            form: 'off',
            spellCheck: false,
          }}
          autoComplete="off"
          className={classes.textField}
        />
      }
      rightContent={
        <TextField
          id="output"
          label={t('tool.format-sql.outputLabel')}
          value={output || ''}
          multiline
          minRows={20}
          variant="outlined"
          autoComplete="off"
          inputProps={{
            spellCheck: false,
            readOnly: true,
          }}
          className={classes.textField}
        />
      }
    />
  );
};

export default SQLBeautify;
