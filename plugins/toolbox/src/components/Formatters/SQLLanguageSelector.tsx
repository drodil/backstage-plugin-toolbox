import { Select } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import { useId } from 'react';

interface SQLLanguageSelectorProps {
  language: string;
  onChange: (language: string) => void;
  languages: string[];
}

export const SQLLanguageSelector = ({
  language,
  onChange,
  languages,
}: SQLLanguageSelectorProps) => {
  const { t } = useToolboxTranslation();
  const uniqueId = useId();
  const getDisplayName = (lang: string) =>
    t(`tool.format-sql.language.${lang}`, { defaultValue: lang });

  return (
    <Select
      id={`sql-language-selector-${uniqueId}`}
      label={t('tool.format-sql.selectLanguageLabel', {
        defaultValue: 'Language',
      })}
      selectedKey={language}
      onSelectionChange={key => onChange(key as string)}
      options={languages.map(m => ({ value: m, label: getDisplayName(m) }))}
    />
  );
};
