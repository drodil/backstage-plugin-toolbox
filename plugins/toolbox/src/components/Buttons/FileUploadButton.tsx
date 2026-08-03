import { ChangeEvent, useId } from 'react';
import { TooltipTrigger, Tooltip, Button } from '@backstage/ui';
import { RiAttachmentLine } from '@remixicon/react';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  onFileLoad: (input: File) => void;
  id?: string;
  buttonText?: string;
  accept?: string;
};

export const FileUploadButton = (props: Props) => {
  const { t } = useToolboxTranslation();
  const generatedId = useId();
  const {
    onFileLoad,
    id = `uploadBtn-${generatedId}`,
    buttonText = t('components.fileUploadButton.buttonText'),
    accept = '*/*',
  } = props;

  return (
    <>
      <TooltipTrigger>
        <label htmlFor={id}>
          <Button variant="tertiary" aria-label={buttonText}>
            <RiAttachmentLine size={16} />
            {buttonText}
          </Button>
        </label>
        <Tooltip>{t('components.fileUploadButton.tooltipTitle')}</Tooltip>
      </TooltipTrigger>
      <input
        type="file"
        accept={accept}
        id={id}
        hidden
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (!e?.target?.files?.length) {
            return null;
          }
          return onFileLoad(e.target.files[0]);
        }}
      />
    </>
  );
};
