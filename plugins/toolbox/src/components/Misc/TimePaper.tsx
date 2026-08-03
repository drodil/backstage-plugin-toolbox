import { Text } from '@backstage/ui';

export const TimePaper = (props: { title: string; value: number }) => {
  const formattedValue = props.value.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return (
    <div
      style={{
        padding: '1rem',
        textAlign: 'center',
        border: '1px solid var(--bui-border-1)',
        borderRadius: 'var(--bui-radius-2)',
      }}
    >
      <Text variant="body-small">{props.title}</Text>
      <Text
        variant="title-large"
        style={{ fontSize: '4rem', display: 'block' }}
      >
        {formattedValue}
      </Text>
    </div>
  );
};
