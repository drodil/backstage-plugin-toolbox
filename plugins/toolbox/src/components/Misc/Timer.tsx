import { useEffect, useState } from 'react';
import { TimePaper } from './TimePaper';
import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  formControl: {
    width: '100%',
  },
  gridContainer: {
    marginBottom: theme.spacing(0.625), // 5px
  },
  timeDisplay: {
    fontSize: '5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing(2), // 16px
  },
  resetButton: {
    backgroundColor: '#E0E0E0',
    color: '#000000',
  },
}));

const Timer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { t } = useToolboxTranslation();
  const classes = useStyles();

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
      <FormControl className={classes.formControl}>
        <Grid container spacing={4} className={classes.gridContainer}>
          <Grid item>
            <ButtonGroup>
              {!isRunning && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStart}
                >
                  {t('tool.countdown.startButton')}
                </Button>
              )}
              {isRunning && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleStop}
                >
                  {t('tool.countdown.stopButton')}
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleReset}
                className={classes.resetButton}
              >
                {t('tool.countdown.resetButton')}
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </FormControl>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <TimePaper
            value={timePassed.hours}
            title={t('tool.countdown.hoursLabel')}
          />
        </Grid>
        <Grid item>
          <TimePaper
            value={timePassed.minutes}
            title={t('tool.countdown.minutesLabel')}
          />
        </Grid>
        <Grid item>
          <TimePaper
            value={timePassed.seconds}
            title={t('tool.countdown.secondsLabel')}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Timer;
