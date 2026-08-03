import { useState } from 'react';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
  SampleButton,
} from '../Buttons';
import { Alert, Flex, TextField } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import styles from '../DefaultEditor/DefaultEditor.module.css';

export const SLACalculator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState({
    daily: '',
    weekly: '',
    monthly: '',
    quarterly: '',
    yearly: '',
  });
  const [error, setError] = useState({ show: false, msg: '' });
  const { t } = useToolboxTranslation();

  const convertTime = (value: number) => {
    let minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const isValidFloat = (value: string) => /^\d+(\.\d*)?$/.test(value);

  const handleChange = (value: string) => {
    if (value.length === 0) {
      setInput('');
      setOutput({
        daily: '',
        weekly: '',
        monthly: '',
        quarterly: '',
        yearly: '',
      });
      return;
    }
    if (!isValidFloat(value)) {
      setError({ show: true, msg: t('tool.sla-calculator.invalidFormat') });
      return;
    }
    setInput(value);
    setError({ show: false, msg: '' });

    let base = parseFloat(value);
    if (base > 100) {
      setError({ show: true, msg: t('tool.sla-calculator.maxValueError') });
      base = 100;
      setInput('100');
    }

    const daily = (24 - (base * 24) / 100) * 60 * 60;
    setOutput({
      daily: convertTime(daily),
      weekly: convertTime(daily * 7),
      monthly: convertTime(daily * 30),
      quarterly: convertTime(daily * 91),
      yearly: convertTime(daily * 365),
    });
  };

  const OutputRow = (props: { label: string; value?: string | null }) => (
    <div style={{ marginBottom: 'var(--bui-space-2)' }}>
      <label className={styles.fieldLabel}>{props.label}</label>
      <Flex gap="2" align="center">
        <input
          className={styles.textarea}
          style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
          readOnly
          value={props.value ?? ''}
        />
        <CopyToClipboardButton output={props.value ?? ''} />
      </Flex>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <Flex gap="2" style={{ marginBottom: 'var(--bui-space-2)' }}>
        <PasteFromClipboardButton setInput={v => handleChange(v)} />
        <ClearValueButton
          setValue={() => {
            handleChange('');
            setError({ show: false, msg: '' });
          }}
        />
        <SampleButton setInput={handleChange} sample="99.9" />
      </Flex>
      <div style={{ maxWidth: '400px', marginBottom: 'var(--bui-space-4)' }}>
        <TextField
          id="input"
          label={t('tool.sla-calculator.inputLabel')}
          value={input}
          onChange={handleChange}
          autoComplete="off"
        />
        {error.show && (
          <Alert
            status="danger"
            description={error.msg}
            style={{ marginTop: 'var(--bui-space-2)' }}
          />
        )}
      </div>
      <hr style={{ margin: '1rem 0', borderColor: 'var(--bui-border-1)' }} />
      <div style={{ maxWidth: '400px' }}>
        <OutputRow
          label={t('tool.sla-calculator.dailyLabel')}
          value={output.daily}
        />
        <OutputRow
          label={t('tool.sla-calculator.weeklyLabel')}
          value={output.weekly}
        />
        <OutputRow
          label={t('tool.sla-calculator.monthlyLabel')}
          value={output.monthly}
        />
        <OutputRow
          label={t('tool.sla-calculator.quarterlyLabel')}
          value={output.quarterly}
        />
        <OutputRow
          label={t('tool.sla-calculator.yearlyLabel')}
          value={output.yearly}
        />
      </div>
    </div>
  );
};

export default SLACalculator;
