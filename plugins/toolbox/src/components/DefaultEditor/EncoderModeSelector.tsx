import { Select } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';

export const EncoderModeSelector = (props: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useToolboxTranslation();
  return (
    <Select
      label={t('encoderModeSelector.label', { defaultValue: 'Mode' })}
      selectedKey={props.value}
      onSelectionChange={key => props.onChange(key as string)}
      options={[
        {
          value: 'withSpecialCharacters',
          label: t('encoderModeSelector.withSpecialCharacters'),
        },
        {
          value: 'withoutSpecialCharacters',
          label: t('components.encoderModeSelector.withoutSpecialCharacters'),
        },
      ]}
    />
  );
};
