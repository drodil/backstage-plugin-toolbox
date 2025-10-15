import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  introText: {
    marginTop: theme.spacing(1), // 8px
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
    borderColor: 'transparent',
    height: '100%',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  cardContent: {
    padding: theme.spacing(2), // 16px
    paddingBottom: theme.spacing(2), // 16px
  },
}));

export type WelcomePageProps = {
  tools: Tool[];
};

export const WelcomePage = (props: WelcomePageProps) => {
  const { tools } = props;
  const { t } = useToolboxTranslation();
  const classes = useStyles();

  return (
    <Box>
      <Typography className={classes.introText}>
        {t('welcomePage.introText')}
      </Typography>
      <Typography className={classes.introText}>
        {t('welcomePage.secondText')}
      </Typography>
      <Grid container className={classes.gridContainer} alignContent="center">
        {tools.map(tool => {
          return (
            <Grid item key={tool.id} xs={3} className={classes.gridItem}>
              <Card
                onClick={() => (window.location.hash = tool.id)}
                className={classes.card}
              >
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
