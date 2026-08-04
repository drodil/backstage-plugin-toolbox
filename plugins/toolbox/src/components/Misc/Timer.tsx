import { useEffect, useState } from 'react';
import { TimePaper } from './TimePaper';
import { Button, Flex } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';

const Timer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { t } = useToolboxTranslation();

  useEffect(() => {
    let intervalId: any;
    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  function formatTime(timeInSeconds: number) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds / 60) % 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return { hours, minutes, seconds };
  }

  const timePassed = formatTime(elapsedTime);

  return (
    <>
      <Flex
        gap="2"
        align="center"
        style={{ marginBottom: 'var(--bui-space-4)' }}
      >
        {!isRunning && (
          <Button variant="primary" onClick={() => setIsRunning(true)}>
            {t('tool.countdown.startButton')}
          </Button>
        )}
        {isRunning && (
          <Button variant="secondary" onClick={() => setIsRunning(false)}>
            {t('tool.countdown.stopButton')}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            setIsRunning(false);
            setElapsedTime(0);
          }}
        >
          {t('tool.countdown.resetButton')}
        </Button>
      </Flex>
      <Flex gap="4" justify="center" align="center">
        <TimePaper
          value={timePassed.hours}
          title={t('tool.countdown.hoursLabel')}
        />
        <TimePaper
          value={timePassed.minutes}
          title={t('tool.countdown.minutesLabel')}
        />
        <TimePaper
          value={timePassed.seconds}
          title={t('tool.countdown.secondsLabel')}
        />
      </Flex>
    </>
  );
};

export default Timer;
