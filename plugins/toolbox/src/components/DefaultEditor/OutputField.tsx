import { CopyToClipboardButton } from '../Buttons';
import { Flex } from '@backstage/ui';
import styles from './DefaultEditor.module.css';

export const OutputField = (props: {
  label: string;
  value?: string | null;
}) => {
  const { label, value } = props;
  return (
    <Flex direction="column" gap="2">
      <label className={styles.fieldLabel}>{label}</label>
      <textarea
        className={styles.textarea}
        readOnly
        value={value ?? ''}
        rows={5}
      />
      <CopyToClipboardButton output={value ?? ''} />
    </Flex>
  );
};
