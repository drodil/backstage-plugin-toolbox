import { makeStyles, MenuItem, Theme } from '@material-ui/core';
import { DefaultSelect } from '../Selects';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  menuItem: {
    padding: theme.spacing(0.75, 2), // 6px 16px
  },
}));

export const EncoderModeSelector = (props: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useToolboxTranslation();
  const classes = useStyles();
  return (
    <DefaultSelect
      value={props.value}
      onChange={e => props.onChange(e.target.value as string)}
      variant="standard"
    >
      <MenuItem value="withSpecialCharacters" className={classes.menuItem}>
        {t('encoderModeSelector.withSpecialCharacters')}
      </MenuItem>
      <MenuItem value="withoutSpecialCharacters" className={classes.menuItem}>
        {t('components.encoderModeSelector.withoutSpecialCharacters')}
      </MenuItem>
    </DefaultSelect>
  );
};
