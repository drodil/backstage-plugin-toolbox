import React from 'react';
import AttachFile from '@mui/icons-material/AttachFile';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

type Props = {
  onFileLoad: (input: File) => void;
  id?: string;
  buttonText?: string;
  accept?: string;
};

export const FileUploadButton = (props: Props) => {
  const {
    onFileLoad,
    id = 'uploadBtn',
    buttonText = 'Upload File',
    accept = '*/*',
  } = props;

  return (
    <>
      <Tooltip arrow title="Upload File">
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e?.target?.files?.length) {
            return null;
          }
          return onFileLoad(e.target.files[0]);
        }}
      />
    </>
  );
};
