import MenuItem from '@mui/material/MenuItem';
import { DefaultSelect } from '../Selects';
import { useToolboxTranslation } from '../../hooks';

export const EncoderModeSelector = (props: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useToolboxTranslation();
  return (
    <DefaultSelect
      value={props.value}
      onChange={e =>
        props.onChange(e.target.value as string)
      }
      variant="standard"
    >
      <MenuItem value='withSpecialCharacters' sx={{ p: '6px 16px !important' }}>
        {t('components.encoderModeSelector.withSpecialCharacters')}
      </MenuItem>
      <MenuItem value='withoutSpecialCharacters' sx={{ p: '6px 16px !important' }}>
        {t('components.encoderModeSelector.withoutSpecialCharacters')}
      </MenuItem>
    </DefaultSelect>
  );
};
