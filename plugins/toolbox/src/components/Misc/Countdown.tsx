import { useEffect, useState } from 'react';
import { TimePaper } from './TimePaper';
import { Button, Flex, Switch } from '@backstage/ui';
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

export const Countdown = () => {
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

  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    if (isRunning) {
      setSecondsLeft(hours * 3600 + minutes * 60 + seconds - 1);
    } else {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
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
          if (chime) playAlert();
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [hours, minutes, seconds, secondsLeft, isRunning, chime]);

  const timeLeft = formatTime(secondsLeft);

  return (
    <>
      <Flex
        gap="2"
        align="center"
        style={{ marginBottom: 'var(--bui-space-4)' }}
      >
        {!isRunning && (
          <Button variant="primary" onClick={handleStart}>
            {t('tool.countdown.startButton')}
          </Button>
        )}
        {isRunning && (
          <Button variant="secondary" onClick={handleStop}>
            {t('tool.countdown.stopButton')}
          </Button>
        )}
        <Button variant="secondary" onClick={handleReset}>
          {t('tool.countdown.resetButton')}
        </Button>
        <Switch isSelected={chime} onChange={setChime}>
          Chime
        </Switch>
      </Flex>
      {!isRunning && (
        <Flex gap="4" style={{ marginBottom: 'var(--bui-space-4)' }}>
          {[
            {
              label: t('tool.countdown.hoursLabel'),
              value: hours,
              setter: setHours,
            },
            {
              label: t('tool.countdown.minutesLabel'),
              value: minutes,
              setter: setMinutes,
            },
            {
              label: t('tool.countdown.secondsLabel'),
              value: seconds,
              setter: setSeconds,
            },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label
                style={{
                  fontSize: 'var(--bui-font-size-1)',
                  color: 'var(--bui-fg-secondary)',
                  display: 'block',
                  marginBottom: 'var(--bui-space-1)',
                }}
              >
                {label}
              </label>
              <input
                type="number"
                value={value}
                min={0}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setter(v);
                }}
                style={{
                  padding: 'var(--bui-space-2) var(--bui-space-3)',
                  border: '1px solid var(--bui-border-1)',
                  borderRadius: 'var(--bui-radius-2)',
                  fontFamily: 'var(--bui-font-regular)',
                  fontSize: 'var(--bui-font-size-2)',
                  background: 'var(--bui-bg-app)',
                  color: 'var(--bui-fg-primary)',
                  width: '100px',
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </Flex>
      )}
      {isRunning && (
        <Flex gap="4" justify="center" align="center">
          <TimePaper
            value={timeLeft.hours}
            title={t('tool.countdown.hoursLabel')}
          />
          <TimePaper
            value={timeLeft.minutes}
            title={t('tool.countdown.minutesLabel')}
          />
          <TimePaper
            value={timeLeft.seconds}
            title={t('tool.countdown.secondsLabel')}
          />
        </Flex>
      )}
    </>
  );
};

export default Countdown;
