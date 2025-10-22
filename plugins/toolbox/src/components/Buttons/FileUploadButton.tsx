import { ChangeEvent, useId } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import AttachFile from '@material-ui/icons/AttachFile';
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
      <Tooltip arrow title={t('components.fileUploadButton.tooltipTitle')}>
        <label htmlFor={id}>
          <Button
            component="span"
            size="small"
            startIcon={<AttachFile />}
            variant="text"
            color="inherit"
          >
            {buttonText}
          </Button>
        </label>
      </Tooltip>
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
