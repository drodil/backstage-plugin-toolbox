import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { useToolboxTranslation } from '../../hooks';
import { useId } from 'react';

interface SQLLanguageSelectorProps {
  language: string;
  onChange: (language: string) => void;
  languages: string[];
}

const useStyles = makeStyles({
  formControl: {
    position: 'relative',
    top: '2px',
  },
});

/**
 * SQLLanguageSelector - Dropdown for selecting SQL language.
 */
export const SQLLanguageSelector = ({
  language,
  onChange,
  languages,
}: SQLLanguageSelectorProps) => {
  const { t } = useToolboxTranslation();
  const getDisplayName = (lang: string) =>
    t(`tool.format-sql.language.${lang}`, { defaultValue: lang });
  const uniqueId = useId();
  const classes = useStyles();

  return (
    <FormControl size="small" className={classes.formControl}>
      <Select
        labelId={`sql-language-label-${uniqueId}`}
        id={`sql-language-selector-${uniqueId}`}
        value={language}
        onChange={e => {
          const value = e.target.value;
          if (typeof value === 'string') {
            onChange(value);
          }
        }}
        name={`sql-language-selector-${uniqueId}`}
      >
        {languages.map(m => (
          <MenuItem key={m} value={m}>
            {getDisplayName(m)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
