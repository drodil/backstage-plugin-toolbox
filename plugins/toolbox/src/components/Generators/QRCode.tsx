import React, {ChangeEvent, useCallback, useMemo} from 'react';
import {DefaultEditor} from '../DefaultEditor';
import {faker} from '@faker-js/faker';
import QRCodeStyling, {CornerDotType, CornerSquareType, DotType, FileExtension, ShapeType} from "qr-code-styling";
import {Box, Button, Select, SelectChangeEvent} from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {configApiRef, useApi} from "@backstage/core-plugin-api";

interface QrCodeSettings {
    cornerSquareType: CornerSquareType;
    cornerSquareColor: string;
    cornerDotType: CornerDotType;
    cornerDotColor: string;
    dotType: DotType;
    dotColor: string;
    shape: ShapeType;
}

export const QRCodeGenerator = () => {
    const [input, setInput] = React.useState('');
    const sample = faker.internet.url();

    const [fileExt, setFileExt] = React.useState<FileExtension>("png");
    const ref = React.useRef(null);

    const config = useApi(configApiRef).getOptionalConfig('app.toolbox.qrCode');

    let defaultColor = '#000';
    const defaults: QrCodeSettings = {
        cornerSquareType: config?.getOptionalString('defaults.cornerSquareType') as CornerSquareType ?? 'square',
        cornerSquareColor: config?.getOptionalString('defaults.cornerSquareColor') ?? defaultColor,
        cornerDotType: config?.getOptionalString('defaults.cornerDotType') as CornerDotType ?? "square",
        cornerDotColor: config?.getOptionalString('defaults.cornerDotColor') ?? defaultColor,
        dotType: config?.getOptionalString('defaults.dotType') as DotType ?? 'square',
        dotColor: config?.getOptionalString('defaults.dotColor') ?? defaultColor,
        shape: config?.getOptionalString('defaults.shape') as ShapeType ?? 'square',
    };

    // settings
    const [settings, setSettings] = React.useState<QrCodeSettings>(defaults);

    const qrCode = useMemo(() => {
        const qr = new QRCodeStyling({
            width: 500,
            height: 500,
            image: "",
            dotsOptions: {
                color: settings.dotColor,
                type: settings.dotType,
            },
            cornersSquareOptions: {
                color: settings.cornerSquareColor,
                type: settings.cornerSquareType,
            },
            cornersDotOptions: {
                color: settings.cornerDotColor,
                type: settings.cornerDotType,
            },
            shape: settings.shape,
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 20
            },
            margin: 5,
        });

        if (ref.current) {
            qr.append(ref.current);
            console.log("Connected")
        }
        return qr;
    }, [ref.current]);


    React.useEffect(() => {
        qrCode.update({
            data: input,
            dotsOptions: {
                color: settings.dotColor,
                type: settings.dotType,
            },
            cornersSquareOptions: {
                color: settings.cornerSquareColor,
                type: settings.cornerSquareType,
            },
            cornersDotOptions: {
                color: settings.cornerDotColor,
                type: settings.cornerDotType,
            },
            shape: settings.shape,
        });
        console.log(input)
    }, [input, settings]);

    const onExtensionChange = (event: SelectChangeEvent) => {
        setFileExt(event.target.value as FileExtension);
    };

    const onDownloadClick = () => {
        void qrCode.download({
            extension: fileExt
        });
    };


    let DownloadOptions = <span>{'File type: '}
        <Select onChange={onExtensionChange}
                label={'file extension'}
                variant={'standard'}
                placeholder={'file extension'}
                defaultValue={'png'}
                key={'selectExtensionChanger'}>
        <MenuItem key={'png'} value={'png'}>png</MenuItem>
        <MenuItem key={'webp'} value={'webp'}>webp</MenuItem>
        <MenuItem key={'jpeg'} value={'jpeg'}>jpeg</MenuItem>
        <MenuItem key={'svg'} value={'svg'}>svg</MenuItem>
    </Select>
        <Button onClick={onDownloadClick} key={'downloadbutton'}>Download</Button>
    </span>;

    return (
        <>
            <Box
                sx={{margin: 5}}>
            </Box>

            <DefaultEditor
                input={input}
                setInput={(value) => {
                    setInput(value);
                }}
                inputProps={{maxLength: 2048}}
                sample={sample}
                rightContent={<div ref={ref}/>}
                extraRightContent={DownloadOptions}
                additionalTools={[
                    <ConfigSelect settingKey={"dotType" as const}
                                  name={"Dot"}
                                  key={'dotSelect'}
                                  types={["square", 'classy', "dots", "classy-rounded", "extra-rounded", 'rounded'] as DotType[]}
                                  settings={settings}
                                  setSettings={setSettings}
                    />,
                    <ConfigSelect settingKey={"cornerSquareType" as const}
                                  name={"Corner Square"}
                                  key={'cornerSquareSelect'}
                                  types={['square', 'dot', 'extra-rounded'] as CornerSquareType[]}
                                  settings={settings}
                                  setSettings={setSettings}
                    />,
                    <ConfigSelect settingKey={"cornerDotType" as const}
                                  name={"Corner Dot"}
                                  key={'cornerDotSelect'}
                                  types={['dot', 'square'] as CornerDotType[]}
                                  settings={settings}
                                  setSettings={setSettings}
                    />,
                    <ConfigSelect settingKey={"shape" as const}
                                  name={"Shape"}
                                  key={'shapeSelect'}
                                  types={['circle', 'square'] as ShapeType[]}
                                  settings={settings}
                                  setSettings={setSettings}
                    />,
                ]}
            />
        </>
    );
};


let ConfigSelect = (props: {
    settingKey: keyof QrCodeSettings,
    name: string,
    types: DotType[] | CornerDotType[] | CornerSquareType[] | ShapeType[]
    settings : QrCodeSettings,
    setSettings : (settings: QrCodeSettings) => void,
}) => {
    const onChange = useCallback((event: SelectChangeEvent) => props.setSettings({
        ...props.settings,
        [props.settingKey]: event.target.value as DotType
    }), [props.settings]);

    const labelId = `label-for-${props.settingKey}`
    let between = '3px';
    let colorSetting = props.settingKey.replace('Type', 'Color') as keyof QrCodeSettings;
    const onChangeColor = useCallback((event: ChangeEvent<HTMLInputElement>) => props.setSettings({
        ...props.settings,
        [colorSetting]: event.target.value as DotType
    }), [props.settings]);

    return (<FormControl key={`formcontrol-for-select-${props.settingKey}`}>
            <InputLabel id={labelId}>{props.name}</InputLabel>
            <Select
                key={`select-for-${props.settingKey}`}
                name={'select'}
                variant="outlined"
                labelId={labelId}
                label={props.name}
                id={`id-${props.settingKey}`}
                onChange={onChange}
                value={props.settings[props.settingKey]}
                sx={{width: 140, margin: `0 ${between}`}}
            >
                {
                    props.types ? props.types.map((value) =>
                        <MenuItem value={value} key={`selectFor${props.name}menu${value}`}>
                            {value}
                        </MenuItem>
                    ) : null
                }
            </Select>
            {props.name !== 'Shape' ? <TextField
                id="input"
                name="input"
                label={`${props.name} color`}
                defaultValue={props.settings[colorSetting]}
                onChange={onChangeColor}
                variant="outlined"
                sx={{width: 140, margin: `10px ${between} 0 ${between}`}}
            /> : null}
        </FormControl>
    );
};

export default QRCodeGenerator;

