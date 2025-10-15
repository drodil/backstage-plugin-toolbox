import { Button, Tooltip } from '@material-ui/core';
import Input from '@material-ui/icons/Input';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  sample: string;
  setInput: (input: string) => void;
};

export const SampleButton = (props: Props) => {
  const { t } = useToolboxTranslation();
  return (
    <Tooltip arrow title={t('components.sampleButton.tooltipTitle')}>
      <Button
        size="small"
        startIcon={<Input />}
        onClick={() => props.setInput(props.sample)}
        variant="text"
        color="inherit"
      >
        {t('components.sampleButton.buttonText')}
      </Button>
    </Tooltip>
  );
};
