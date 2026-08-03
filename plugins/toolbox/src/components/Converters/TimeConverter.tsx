import { useState } from 'react';
import { DateTime } from 'luxon';
import {
  ClearValueButton,
  CopyToClipboardButton,
  PasteFromClipboardButton,
} from '../Buttons';
import { Button, Flex, Select, TextField } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import styles from '../DefaultEditor/DefaultEditor.module.css';

export const TimeConverter = () => {
  const [input, setInput] = useState<DateTime | null>(null);
  const [inputType, setInputType] = useState('unix');
  const { t } = useToolboxTranslation();

  const getInputStr = () => {
    if (input === null) return '';
    switch (inputType) {
      default:
      case 'unix':
        return input?.toSeconds().toFixed(0).toString();
      case 'iso8601':
        return input.toISO();
      case 'milliseconds':
        return input.toMillis().toString(10);
      case 'rfc2822':
        return input.toRFC2822();
      case 'http':
        return input.toHTTP();
      case 'sql':
        return input.toSQL();
    }
  };

  const handleChange = (value: string) => {
    if (value.length === 0) {
      setInput(null);
      return;
    }
    switch (inputType) {
      default:
      case 'unix':
        setInput(DateTime.fromSeconds(Number.parseInt(value, 10)));
        break;
      case 'iso8601':
        setInput(DateTime.fromISO(value));
        break;
      case 'milliseconds':
        setInput(DateTime.fromMillis(Number.parseInt(value, 10)));
        break;
      case 'rfc2822':
        setInput(DateTime.fromRFC2822(value));
        break;
      case 'http':
        setInput(DateTime.fromHTTP(value));
        break;
      case 'sql':
        setInput(DateTime.fromSQL(value));
        break;
    }
  };

  const OutputRow = (props: { label: string; value?: string | null }) => (
    <div style={{ marginBottom: 'var(--bui-space-2)' }}>
      <label className={styles.fieldLabel}>{props.label}</label>
      <Flex gap="2" align="center">
        <input
          className={styles.textarea}
          style={{
            minHeight: 'unset',
            height: '40px',
            resize: 'none',
            flex: 1,
          }}
          readOnly
          value={props.value ?? ''}
        />
        <CopyToClipboardButton output={props.value ?? ''} />
      </Flex>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ maxWidth: '600px' }}>
        <Flex gap="2" style={{ marginBottom: 'var(--bui-space-2)' }}>
          <PasteFromClipboardButton setInput={v => handleChange(v)} />
          <ClearValueButton setValue={() => handleChange('')} />
          <Button variant="secondary" onClick={() => setInput(DateTime.now())}>
            {t('tool.time-convert.labelNow')}
          </Button>
        </Flex>
        <Flex
          gap="4"
          align="center"
          style={{ marginBottom: 'var(--bui-space-4)' }}
        >
          <div style={{ flex: 1 }}>
            <TextField
              id="input"
              label={t('tool.time-convert.labelInput')}
              value={getInputStr() ?? ''}
              onChange={val => handleChange(val)}
              autoComplete="off"
            />
          </div>
          <Select
            label={t('tool.time-convert.inputType')}
            selectedKey={inputType}
            onSelectionChange={key => setInputType(key as string)}
            options={[
              { value: 'unix', label: t('tool.time-convert.unixTime') },
              {
                value: 'milliseconds',
                label: t('tool.time-convert.millisecondsTime'),
              },
              { value: 'iso8601', label: 'ISO8601' },
              { value: 'sql', label: 'SQL' },
              { value: 'rfc2822', label: 'RFC2822' },
              { value: 'http', label: 'HTTP' },
            ]}
          />
        </Flex>
      </div>
      <hr style={{ margin: '1rem 0', borderColor: 'var(--bui-border-1)' }} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 'var(--bui-space-4)',
        }}
      >
        <div>
          <OutputRow
            label={`${t('tool.time-convert.outputLabel.local')} (ISO8601)`}
            value={input?.toLocal().toString()}
          />
          <OutputRow label="UTC (ISO8601)" value={input?.toUTC().toString()} />
          <OutputRow label="Relative" value={input?.toRelative()} />
          <OutputRow
            label={t('tool.time-convert.outputLabel.unix')}
            value={input?.toSeconds().toFixed(0).toString()}
          />
          <OutputRow label="RFC2822" value={input?.toRFC2822()} />
          <OutputRow label="HTTP" value={input?.toHTTP()} />
        </div>
        <div>
          <OutputRow
            label={t('tool.time-convert.outputLabel.dayOfTheWeek')}
            value={input?.toFormat('c')}
          />
          <OutputRow
            label={t('tool.time-convert.outputLabel.weekNumber')}
            value={input?.toFormat('W')}
          />
          <OutputRow
            label={t('tool.time-convert.outputLabel.quarter')}
            value={input?.toFormat('q')}
          />
          <OutputRow
            label={t('tool.time-convert.outputLabel.dayOfTheYear')}
            value={input?.toFormat('o')}
          />
          <OutputRow
            label={t('tool.time-convert.outputLabel.leapYear')}
            value={input?.isInLeapYear ? 'true' : 'false'}
          />
        </div>
        <div>
          <OutputRow
            label={t('tool.time-convert.outputLabel.local')}
            value={input?.toLocaleString(DateTime.DATETIME_FULL)}
          />
          <OutputRow label="SQL" value={input?.toSQL()} />
          <OutputRow label="YYYY-MM-DD" value={input?.toFormat('yyyy-MM-dd')} />
          <OutputRow label="DD/MM/YYYY" value={input?.toFormat('dd/MM/yyyy')} />
          <OutputRow
            label={t('tool.time-convert.outputLabel.timezone')}
            value={input?.toFormat('z')}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;
