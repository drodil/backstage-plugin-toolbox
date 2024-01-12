import React from 'react';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

export type WelcomePageProps = {
  tools: Tool[];
};

const useStyles = makeStyles(theme => {
  return {
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
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
      marginTop: '1rem',
    },
  };
});

export const WelcomePage = (props: WelcomePageProps) => {
  const { tools } = props;
  const classes = useStyles();
  return (
    <Box>
      <Typography className={classes.textBlock}>
        Toolbox contains commonly used tools in development and design. These
        tools include encoding, generation of data, conversion tools and other
        utilities to make working easier. All data is kept in this domain so you
        don't have to worry about your data getting into wrong hands.
      </Typography>
      <Typography className={classes.textBlock}>
        To select tools click cards below or the left side navigation.
      </Typography>
      <Grid container className={classes.textBlock} alignContent="center">
        {tools.map(tool => {
          return (
            <Grid item key={tool.id} xs={3}>
              <Card
                onClick={() => (window.location.hash = tool.id)}
                className={classes.card}
              >
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {tool.category ?? 'Miscellaneous'}
                  </Typography>
                  <Typography variant="h6">{tool.name}</Typography>
                  <Typography variant="body2" component="p">
                    {tool.description}
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
