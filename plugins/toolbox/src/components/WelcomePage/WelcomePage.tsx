import React from 'react';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { makeStyles } from 'tss-react/mui';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { useToolboxTranslation } from '../../hooks';

export type WelcomePageProps = {
  tools: Tool[];
};

const useStyles = makeStyles()(theme => {
  return {
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: '14px !important',
    },
    card: {
      cursor: 'pointer',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      height: '100%',
      '&:hover': {
        borderColor: theme.palette.primary.light,
      },
    },
    textBlock: {
      marginTop: '1rem !important',
    },
  };
});

export const WelcomePage = (props: WelcomePageProps) => {
  const { tools } = props;
  const { classes } = useStyles();
  const { t, i18n_UNSAFE } = useToolboxTranslation();

  return (
    <Box>
      <Typography className={classes.textBlock}>
        {t('welcomePage.introText')}
      </Typography>
      <Typography className={classes.textBlock}>
        {t('welcomePage.secondText')}
      </Typography>
      <Grid
        container
        className={classes.textBlock}
        sx={{ p: 0, mx: '-8px', mb: '-8px' }}
        alignContent="center"
      >
        {tools.map(tool => {
          return (
            <Grid
              item
              key={tool.id}
              xs={3}
              sx={{ p: '8px', pt: '8px !important', pl: '8px !important' }}
            >
              <Card
                onClick={() => (window.location.hash = tool.id)}
                className={classes.card}
              >
                <CardContent sx={{ p: '16px', pb: '16px !important' }}>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {tool.category ?? 'Miscellaneous'}
                  </Typography>
                  <Typography variant="h6">{i18n_UNSAFE(`tool.${tool.id}.name`, tool.name)}</Typography>
                  <Typography variant="body2" component="p">
                    {i18n_UNSAFE(`tool.${tool.id}.description`, tool.description)}
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
