import { Button, Tooltip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
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
    <Tooltip title={t('components.fileDownloadButton.tooltipTitle')} arrow>
      <Button
        size="small"
        startIcon={<GetAppIcon />}
        onClick={download}
        variant="text"
        color="inherit"
      >
        {t('components.fileDownloadButton.buttonText')}
      </Button>
    </Tooltip>
  );
};
