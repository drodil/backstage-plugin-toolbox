import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => {
  return {
    fullWidth: {
      width: '100%',
    },
    fullHeight: {
      height: '100%',
    },
    noPadding: {
      padding: '0 !important',
    },
    noMargin: {
      margin: '0 !important',
    },
    marginBottomSmall: {
      marginBottom: theme.spacing(1),
    },
    toolsBar: {
      borderLeft: `1px solid ${theme.palette.divider}`,
      padding: '0 !important',
    },
    menuTabs: {
      height: '100%',
    },
    tabDivider: {
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(1),
      color: theme.palette.primary.main,
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    search: {
      margin: theme.spacing(2),
      display: 'flex',
      '& input': {
        marginLeft: theme.spacing(2),
        width: '100%',
        flex: 1,
      },
    },
    previewPaper: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  };
});
