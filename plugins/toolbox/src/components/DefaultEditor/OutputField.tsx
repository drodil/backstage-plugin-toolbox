import { CopyToClipboardButton } from '../Buttons';
import { Flex } from '@backstage/ui';
import styles from './DefaultEditor.module.css';

export const OutputField = (props: {
  label: string;
  value?: string | null;
  rows?: number;
  flexDirection?: 'row' | 'column';
  textAreaStyle?: React.CSSProperties;
}) => {
  const { label, value, flexDirection, rows, textAreaStyle } = props;
  return (
    <Flex direction={flexDirection ?? 'column'} gap="2">
      <label className={styles.fieldLabel}>{label}</label>
      <textarea
        className={styles.textarea}
        readOnly
        value={value ?? ''}
        rows={rows ?? 5}
        style={textAreaStyle ?? {}}
      />
      <CopyToClipboardButton output={value ?? ''} />
    </Flex>
  );
};
