import { DiffEditor } from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, Grid } from '@material-ui/core';
import { useStyles } from '../../utils/hooks';
import * as monaco from 'monaco-editor';
import { useEffectOnce } from 'react-use';
import { Select, SelectItem } from '@backstage/core-components';

const options: monaco.editor.IDiffEditorConstructionOptions = {
    originalEditable: true,
    diffCodeLens: true,
    dragAndDrop: true,
    tabCompletion: 'on',
    renderSideBySide: true,
};

const FileUploader = ({
                          onFileLoad,
                          id,
                          buttonText,
                      }: {
    onFileLoad: Function;
    id: string;
    buttonText: string;
}) => {
    return (
        <>
            <input
                type="file"
                accept="*/*"
                id={id}
                hidden
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e?.target?.files && e.target.files.length) {
                        return onFileLoad(e.target.files[0]);
                    }
                    return null;
                }}
            />
            <label htmlFor={id}>
                <Button variant="contained" color="primary" component="span">
                    {buttonText}
                </Button>
            </label>
        </>
    );
};

function readFileAndSetText(
    file: File | undefined,
    setText: (value: ((prevState: string) => string) | string) => void,
    setLanguage: (value: ((prevState: string) => string) | string) => void,
    allowedLanguages: MonacoLanguages[],
) {
    if (file) {
        const reader = new FileReader();
        reader.onload = async e => {
            // @ts-ignore
            setText(e.target.result);
        };
        reader.readAsText(file);
        let newLanguage = 'plaintext';
        const extension = `.${file.name.split('.').pop()}`;
        if (allowedLanguages?.length) {
            for (let i = 0; i < allowedLanguages.length; i++) {
                if (allowedLanguages[i].extensions.includes(extension as string)) {
                    newLanguage = allowedLanguages[i].name;
                    break;
                }
            }
        }
        setLanguage(newLanguage);
    }
}

export type MonacoLanguages = { name: string; extensions: string[] };

function Diff() {
    const styles = useStyles();
    const [originalFile, setOriginalFile] = useState<File>();
    const [modifiedFile, setModifiedFile] = useState<File>();

    const [originalText, setOriginalText] = useState(
        `Backstage toolbox\n\ncompare text`,
    );
    const [modifiedText, setModifiedText] = useState(
        `Backstage toolbox\ndiff editor`,
    );
    const [language, setLanguage] = useState('plaintext');

    const [allowedLanguages, setAllowedLanguages] = useState<MonacoLanguages[]>(
        [],
    );

    const handleLanguageSelect = (selected: any) => {
        setLanguage(selected);
    };

    useEffect(() => {
        readFileAndSetText(
            modifiedFile,
            setModifiedText,
            setLanguage,
            allowedLanguages,
        );
    }, [modifiedFile, allowedLanguages]);

    useEffect(() => {
        readFileAndSetText(
            originalFile,
            setOriginalText,
            setLanguage,
            allowedLanguages,
        );
    }, [originalFile, allowedLanguages]);

    useEffectOnce(() => {
        const languages: MonacoLanguages[] = monaco.languages
            .getLanguages()
            .map(each => {
                return { name: each.id, extensions: each.extensions || [] };
            });
        setAllowedLanguages(languages);
    });

    const languageOptions: SelectItem[] = allowedLanguages
        ? allowedLanguages.map(i => ({ label: i.name, value: i.name }))
        : [{ label: 'Loading...', value: 'loading' }];

    return (
        <>
            <FormControl className={styles.fullWidth}>
                <Grid container style={{ width: '100%' }}>
                    <Grid item style={{ minWidth: '200px' }}>
                        <Select
                            selected={language}
                            onChange={handleLanguageSelect}
                            items={languageOptions}
                            label="Select File Language Type"
                        />
                    </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '5px', width: '100%' }}>
                    <Grid item style={{ width: '50%' }}>
                        <FileUploader
                            onFileLoad={setOriginalFile}
                            id="originalFile"
                            buttonText="Upload Original File"
                        />
                    </Grid>
                    <Grid item style={{ width: '50%' }}>
                        <FileUploader
                            onFileLoad={setModifiedFile}
                            id="modifiedFile"
                            buttonText="Upload Modified File"
                        />
                    </Grid>
                </Grid>
                <DiffEditor
                    height="100vh"
                    original={originalText}
                    modified={modifiedText}
                    options={options}
                    language={language}
                />
            </FormControl>
        </>
    );
}

export default Diff;
