import React from 'react';
import { Tool } from '../Root';
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
  };
});

export const WelcomePage = (props: WelcomePageProps) => {
  const { tools } = props;
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="subtitle1">Welcome to Toolbox!</Typography>
      <Typography style={{ marginTop: '1rem' }}>
        Toolbox contains commonly used tools in development and other areas.
        These tools include encoding, generation of data, conversion tools and
        other utilities to make working easier. All data is kept in this domain
        so you don't have to worry about your data getting in to wrong hands.
      </Typography>
      <Typography style={{ marginTop: '1rem' }}>
        You can find all available tools from the left side navigation, or from
        this page.
      </Typography>
      <Grid container style={{ marginTop: '1rem' }} alignContent="center">
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
