import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useToolboxTranslation } from '../../hooks';
import { useId } from 'react';

interface SQLLanguageSelectorProps {
  language: string;
  onChange: (language: string) => void;
  languages: string[];
}

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

  return (
    <FormControl size="small" sx={{ minWidth: 175 }}>
      <InputLabel
        id={`sql-language-label-${uniqueId}`}
        sx={{
          zIndex: 0,
        }}
      >
        Language
      </InputLabel>
      <Select
        labelId={`sql-language-label-${uniqueId}`}
        id={`sql-language-selector-${uniqueId}`}
        value={language}
        label="Language"
        onChange={e => onChange(e.target.value)}
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
