import React, { useEffect, useState } from 'react';
import { TimePaper } from './TimePaper';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useToolboxTranslation } from '../../hooks';

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

const Countdown = () => {
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

  const handleChimeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <FormControl style={{ width: '100%' }}>
        <Grid container spacing={4} style={{ marginBottom: '5px' }}>
          <Grid item>
            <ButtonGroup
              sx={{
                p: '16px !important',
                pl: '0 !important',
                pt: '0 !important',
              }}
            >
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
                sx={{
                  backgroundColor: '#E0E0E0',
                  color: '#000000 !important',
                  '&:hover': {
                    backgroundColor: '#E0E0E0',
                  },
                }}
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
