import React from 'react';
import GetAppIcon from '@mui/icons-material/GetApp';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

export type FileDownloadButtonProps = {
  content: string;
  fileName: string;
  fileType: string;
};

export const FileDownloadButton = (props: FileDownloadButtonProps) => {
  const { content, fileName, fileType } = props;
  const download = () => {
    const link = document.createElement('a');
    const file = new Blob([content], { type: fileType });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
  };

  return (
    <Tooltip title="Download file" arrow>
      <Button
        size="small"
        startIcon={<GetAppIcon />}
        onClick={download}
        variant="text"
        color="inherit"
      >
        Download file
      </Button>
    </Tooltip>
  );
};
