import { TooltipTrigger, Tooltip, Button } from '@backstage/ui';
import { RiDownloadLine } from '@remixicon/react';
import { useToolboxTranslation } from '../../hooks';

export type FileDownloadButtonProps = {
  content: string;
  fileName: string;
  fileType: string;
};

export const FileDownloadButton = (props: FileDownloadButtonProps) => {
  const { content, fileName, fileType } = props;
  const { t } = useToolboxTranslation();
  const download = () => {
    const link = document.createElement('a');
    const file = new Blob([content], { type: fileType });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
  };

  return (
    <TooltipTrigger>
      <Button variant="tertiary" onClick={download}>
        <RiDownloadLine size={16} />
        {t('components.fileDownloadButton.buttonText')}
      </Button>
      <Tooltip>{t('components.fileDownloadButton.tooltipTitle')}</Tooltip>
    </TooltipTrigger>
  );
};
