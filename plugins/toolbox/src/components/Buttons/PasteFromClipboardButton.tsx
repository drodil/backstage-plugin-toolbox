import { Button, Tooltip } from '@material-ui/core';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  setInput: (input: string) => void;
  title?: string;
};

export const PasteFromClipboardButton = (props: Props) => {
  const { t } = useToolboxTranslation();
  const pasteFromClipboard = () => {
    navigator.clipboard.readText().then(
      text => props.setInput(text),
      // TODO: handle error
    );
  };
  return (
    <Tooltip
      arrow
      title={
        props.title ?? t('components.pasteFromClipboardButton.tooltipTitle')
      }
    >
      <Button
        size="small"
        startIcon={<AssignmentReturnedIcon />}
        onClick={pasteFromClipboard}
        variant="text"
        color="inherit"
      >
        {t('components.pasteFromClipboardButton.buttonText')}
      </Button>
    </Tooltip>
  );
};
