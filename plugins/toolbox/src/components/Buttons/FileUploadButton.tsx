import {Button, Tooltip} from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import React from "react";

type Props = {
    onFileLoad: (input: File) => void;
    id: string;
    buttonText?: string;
};

export const FileUploadButton = (props: Props) => {
    const { onFileLoad, id, buttonText = "Upload File" } = props;

    return (
        <>
            <Tooltip arrow title="Upload File">
                <label htmlFor={id}>
                    <Button
                        component="span"
                        size="small"
                        startIcon={<AttachFile />}
                    >
                        {buttonText}
                    </Button>
                </label>
            </Tooltip>
            <input
                type="file"
                accept="*/*"
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