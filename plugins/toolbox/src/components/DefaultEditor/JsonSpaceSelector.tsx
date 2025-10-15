import { makeStyles, MenuItem, Theme } from '@material-ui/core';
import { DefaultSelect } from '../Selects';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  menuItem: {
    padding: theme.spacing(0.75, 2), // 6px 16px
  },
}));

export const JsonSpaceSelector = (props: {
  spaces: number;
  onChange: (spaces: number) => void;
}) => {
  const { t } = useToolboxTranslation();
  const classes = useStyles();
  return (
    <DefaultSelect
      value={props.spaces}
      onChange={e =>
        props.onChange(Number.parseInt(e.target.value as string, 10))
      }
    >
      <MenuItem value={2} className={classes.menuItem}>
        {t('components.jsonSpaceSelector.space', { count: 2 })}
      </MenuItem>
      <MenuItem value={3} className={classes.menuItem}>
        {t('components.jsonSpaceSelector.space', { count: 3 })}
      </MenuItem>
      <MenuItem value={4} className={classes.menuItem}>
        {t('components.jsonSpaceSelector.space', { count: 4 })}
      </MenuItem>
      <MenuItem value={8} className={classes.menuItem}>
        {t('components.jsonSpaceSelector.space', { count: 8 })}
      </MenuItem>
    </DefaultSelect>
  );
};
