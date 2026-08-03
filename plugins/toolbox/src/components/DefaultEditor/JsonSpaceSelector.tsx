import { Select } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';

export const JsonSpaceSelector = (props: {
  spaces: number;
  onChange: (spaces: number) => void;
}) => {
  const { t } = useToolboxTranslation();
  return (
    <Select
      label={t('components.jsonSpaceSelector.label', {
        defaultValue: 'Spaces',
      })}
      selectedKey={String(props.spaces)}
      onSelectionChange={key =>
        props.onChange(Number.parseInt(key as string, 10))
      }
      options={[
        {
          value: '2',
          label: t('components.jsonSpaceSelector.space', { count: 2 }),
        },
        {
          value: '3',
          label: t('components.jsonSpaceSelector.space', { count: 3 }),
        },
        {
          value: '4',
          label: t('components.jsonSpaceSelector.space', { count: 4 }),
        },
        {
          value: '8',
          label: t('components.jsonSpaceSelector.space', { count: 8 }),
        },
      ]}
    />
  );
};
