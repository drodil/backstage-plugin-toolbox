import { useEffect, useState } from 'react';
import { DefaultEditor } from '../DefaultEditor';
import { format } from 'sql-formatter';
import { useToolboxTranslation } from '../../hooks';
import { SQLLanguageSelector } from './SQLLanguageSelector';
import styles from '../DefaultEditor/DefaultEditor.module.css';

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
        <>
          <label htmlFor="input" className={styles.fieldLabel}>
            {t('tool.format-sql.inputLabel')}
          </label>
          <textarea
            name="editorSqlInput_abc1234"
            id="input"
            className={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={20}
            autoComplete="off"
            spellCheck={false}
          />
        </>
      }
      rightContent={
        <>
          <label htmlFor="output" className={styles.fieldLabel}>
            {t('tool.format-sql.outputLabel')}
          </label>
          <textarea
            id="output"
            className={styles.textarea}
            value={output || ''}
            rows={20}
            autoComplete="off"
            spellCheck={false}
            readOnly
          />
        </>
      }
    />
  );
};

export default SQLBeautify;
