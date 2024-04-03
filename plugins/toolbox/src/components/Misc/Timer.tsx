import React, { useEffect, useState } from 'react';
import { useStyles } from '../../utils/hooks';
import { TimePaper } from './TimePaper';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const Timer = () => {
  const { classes } = useStyles();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: any;

    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  function formatTime(timeInSeconds: number) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds / 60) % 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return { hours, minutes, seconds };
  }

  const timePassed = formatTime(elapsedTime);

  return (
    <>
      <FormControl className={classes.fullWidth}>
        <Grid container spacing={4} style={{ marginBottom: '5px' }}>
          <Grid item>
            <ButtonGroup>
              {!isRunning && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStart}
                >
                  Start
                </Button>
              )}
              {isRunning && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleStop}
                >
                  Stop
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{
                  backgroundColor: '#E0E0E0',
                  color: '#000000 !important',
                  '&:hover': {
                    backgroundColor: '#E0E0E0',
                  },
                }}
              >
                Reset
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </FormControl>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <TimePaper value={timePassed.hours} title="Hours" />
        </Grid>
        <Grid item>
          <TimePaper value={timePassed.minutes} title="Minutes" />
        </Grid>
        <Grid item>
          <TimePaper value={timePassed.seconds} title="Seconds" />
        </Grid>
      </Grid>
    </>
  );
};

export default Timer;
