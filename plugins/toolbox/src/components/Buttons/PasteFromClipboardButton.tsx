import { TooltipTrigger, Tooltip, Button } from '@backstage/ui';
import { RiClipboardLine } from '@remixicon/react';
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
    <TooltipTrigger>
      <Button variant="tertiary" onClick={pasteFromClipboard}>
        <RiClipboardLine size={16} />
        {t('components.pasteFromClipboardButton.buttonText')}
      </Button>
      <Tooltip>
        {props.title ?? t('components.pasteFromClipboardButton.tooltipTitle')}
      </Tooltip>
    </TooltipTrigger>
  );
};
