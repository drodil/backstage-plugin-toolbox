import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { FAVORITES_STORAGE } from '../components/Buttons/FavoriteButton';

export const useFavoriteStorage = () => {
  const [favorites, setFavorites] = React.useState<string[]>([]);
  useEffect(() => {
    function checkFavorites() {
      const item = localStorage.getItem(FAVORITES_STORAGE);
      if (item) {
        try {
          setFavorites(JSON.parse(item));
        } catch (_) {
          setFavorites([]);
          localStorage.removeItem(FAVORITES_STORAGE);
        }
      }
    }

    checkFavorites();
    window.addEventListener(FAVORITES_STORAGE, checkFavorites);
    return () => {
      window.removeEventListener(FAVORITES_STORAGE, checkFavorites);
    };
  }, []);
  return favorites;
};

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
    marginLeftSmall: {
      marginLeft: theme.spacing(1),
    },
    editorButtonGroup: {
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    toolsBar: {
      borderRight: `1px solid ${theme.palette.divider}`,
      padding: '0 !important',
    },
    menuTabs: {
      height: 'calc(100vh - 160px);',
      '& div[class*="MuiTabScrollButton-vertical"]': {
        height: '10px',
      },
    },
    tab: {
      color: theme.palette.link,
      '&:hover': {
        color: theme.palette.linkHover,
        background: 'transparent',
      },
      '&[aria-selected="true"]': {
        fontWeight: 'bold',
      },
    },
    tabDivider: {
      marginTop: theme.spacing(1),
      paddingTop: theme.spacing(1),
      paddingBottom: 0,
      color: theme.palette.text.primary,
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    search: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(1),
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
    toolContainer: {
      padding: '1rem',
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      zIndex: 10000,
      backgroundColor: theme.palette.background.default,
    },
  };
});
