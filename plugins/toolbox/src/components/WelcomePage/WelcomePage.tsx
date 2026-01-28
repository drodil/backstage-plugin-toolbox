import { useState } from 'react';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useToolboxTranslation } from '../../hooks';
import { Alert } from '@material-ui/lab';
import { NewIndicator } from '../Badges/NewIndicator';

const useStyles = makeStyles<Theme>(theme => ({
  introText: {
    marginTop: theme.spacing(1), // 8px
  },
  searchPaper: {
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    height: '48px',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
  },
  searchInput: {
    paddingLeft: theme.spacing(2),
    flex: 1,
  },
  noTools: {
    width: '100%',
    margin: theme.spacing(1),
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    paddingRight: 0,
  },
  gridContainer: {
    padding: 0,
    margin: theme.spacing(-1), // -8px
    marginBottom: theme.spacing(-1), // -8px
    marginTop: theme.spacing(1), // 8px
  },
  gridItem: {
    padding: theme.spacing(1), // 8px
    paddingTop: theme.spacing(1), // 8px
    paddingLeft: theme.spacing(1), // 8px
  },
  card: {
    cursor: 'pointer',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    height: '100%',
    position: 'relative',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  cardContent: {
    padding: theme.spacing(2), // 16px
    paddingBottom: theme.spacing(2), // 16px
  },
  newBadge: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1,
  },
}));

export type WelcomePageProps = {
  tools: Tool[];
};

export const WelcomePage = (props: WelcomePageProps) => {
  const { tools } = props;
  const { t } = useToolboxTranslation();
  const classes = useStyles();
  const [search, setSearch] = useState('');

  const filteredTools = tools.filter(tool => {
    if (!search) {
      return true;
    }
    const toolName = t(`tool.${tool.id}.name`, {
      defaultValue: tool.displayName ?? tool.name,
    });
    const description = t(`tool.${tool.id}.description`, {
      defaultValue: tool.description,
    });
    return (
      toolName.toLowerCase().includes(search.toLowerCase()) ||
      tool.id.toLowerCase().includes(search.toLowerCase()) ||
      tool.aliases?.some(alias =>
        alias.toLowerCase().includes(search.toLowerCase()),
      ) ||
      description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box>
      <Typography className={classes.introText}>
        {t('welcomePage.introText')}
      </Typography>
      <Typography className={classes.introText}>
        {t('welcomePage.secondText')}
      </Typography>
      <Paper component="form" className={classes.searchPaper}>
        <InputBase
          placeholder={t('welcomePage.search')}
          inputProps={{ 'aria-label': 'Search' }}
          className={classes.searchInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          value={search}
        />
        <IconButton disabled aria-label="search" className={classes.searchIcon}>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Grid container className={classes.gridContainer} alignContent="center">
        {filteredTools.length === 0 && (
          <Alert severity="warning" className={classes.noTools}>
            {t('welcomePage.noToolsFound')}
          </Alert>
        )}
        {filteredTools.map(tool => {
          return (
            <Grid item key={tool.id} xs={3} className={classes.gridItem}>
              <Card
                onClick={() => (window.location.hash = tool.id)}
                className={classes.card}
              >
                {tool.isNew && (
                  <Box className={classes.newBadge}>
                    <NewIndicator
                      ariaLabel={t('welcomePage.badge.new', {
                        defaultValue: 'New',
                      })}
                    />
                  </Box>
                )}
                <CardContent className={classes.cardContent}>
                  <Typography color="textSecondary" gutterBottom>
                    {t(
                      `tool.category.${(
                        tool.category ?? 'miscellaneous'
                      ).toLowerCase()}`,
                      {
                        defaultValue: tool.category ?? 'Miscellaneous',
                      },
                    )}
                  </Typography>
                  <Typography variant="h6">
                    {t(`tool.${tool.id}.name`, { defaultValue: tool.name })}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {t(`tool.${tool.id}.description`, {
                      defaultValue: tool.description,
                    })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
