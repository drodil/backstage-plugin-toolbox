import { ChangeEvent, useEffect, useState } from 'react';
import { TimePaper } from './TimePaper';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  TextField,
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
  buttonGroup: {
    padding: theme.spacing(2), // 16px
    paddingLeft: 0,
    paddingTop: 0,
  },
  resetButton: {
    backgroundColor: '#E0E0E0',
    color: '#000000',
  },
}));

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const audioContext = new AudioContext();
const beep = (frequency: number) => {
  const beep_decay = 1.5;
  const o = audioContext.createOscillator();
  const g = audioContext.createGain();
  o.connect(g);
  o.type = 'sine';
  o.frequency.value = frequency;
  g.connect(audioContext.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(
    0.00001,
    audioContext.currentTime + beep_decay,
  );
};

async function playAlert() {
  beep(440.0);
  await sleep(200);
  beep(440.0);
  await sleep(200);
  beep(440.0);
}

export const Countdown = () => {
  const classes = useStyles();
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [chime, setChime] = useState(true);
  const { t } = useToolboxTranslation();

  const formatTime = (timeInSeconds: number) => {
    const hoursLeft = Math.floor(timeInSeconds / 3600);
    const minutesLeft = Math.floor((timeInSeconds / 60) % 60);
    const secondsL = Math.floor(timeInSeconds % 60);
    return { hours: hoursLeft, minutes: minutesLeft, seconds: secondsL };
  };

  const handleStart = () => {
    const time = hours * 3600 + minutes * 60 + seconds - 1;
    if (time > 0) {
      setSecondsLeft(time);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (isRunning) {
      const time = hours * 3600 + minutes * 60 + seconds - 1;
      setSecondsLeft(time);
    } else {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

  const handleChimeToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setChime(event.target.checked);
  };

  useEffect(() => {
    let intervalId: any;

    if (isRunning) {
      intervalId = setInterval(() => {
        const time = secondsLeft - 1;
        if (time > 0) {
          setSecondsLeft(time);
        } else if (time <= 0) {
          setIsRunning(false);
          if (chime) {
            playAlert();
          }
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [hours, minutes, seconds, secondsLeft, isRunning, chime]);

  const timeLeft = formatTime(secondsLeft);
  return (
    <>
      <FormControl className={classes.formControl}>
        <Grid container spacing={4} className={classes.gridContainer}>
          <Grid item>
            <ButtonGroup className={classes.buttonGroup}>
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
            <FormControlLabel
              control={<Switch defaultChecked onChange={handleChimeToggle} />}
              label="Chime"
              labelPlacement="start"
            />
          </Grid>
        </Grid>
      </FormControl>
      {!isRunning && (
        <Grid container spacing={4}>
          <Grid item>
            <TextField
              label={t('tool.countdown.hoursLabel')}
              type="number"
              value={hours}
              variant="standard"
              autoComplete="off"
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setHours(val);
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t('tool.countdown.minutesLabel')}
              type="number"
              value={minutes}
              variant="standard"
              autoComplete="off"
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setMinutes(val);
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label={t('tool.countdown.secondsLabel')}
              type="number"
              value={seconds}
              variant="standard"
              autoComplete="off"
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setSeconds(val);
                }
              }}
            />
          </Grid>
        </Grid>
      )}
      {isRunning && (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <TimePaper
              value={timeLeft.hours}
              title={t('tool.countdown.hoursLabel')}
            />
          </Grid>
          <Grid item>
            <TimePaper
              value={timeLeft.minutes}
              title={t('tool.countdown.minutesLabel')}
            />
          </Grid>
          <Grid item>
            <TimePaper
              value={timeLeft.seconds}
              title={t('tool.countdown.secondsLabel')}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Countdown;
