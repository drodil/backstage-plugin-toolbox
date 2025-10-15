import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { faker } from '@faker-js/faker';
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
  ShapeType,
} from 'qr-code-styling';
import QRCodeStyling from 'qr-code-styling';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  TextField,
} from '@material-ui/core';
import {
  DefaultEditor,
  useToolboxTranslation,
} from '@drodil/backstage-plugin-toolbox';

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { DefaultSelect } from '../Selects';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme>(theme => ({
  select: {
    margin: `0 ${theme.spacing(1.25)}px`, // 10px between
  },
  colorTextField: {
    margin: `${theme.spacing(1.25)}px ${theme.spacing(
      1.25,
    )}px 0 ${theme.spacing(1.25)}px`, // 10px between 0 between
  },
  downloadSpan: {
    marginLeft: theme.spacing(4), // 2rem = 32px
  },
  box: {
    margin: theme.spacing(5), // 40px
  },
}));

interface QrCodeSettings {
  cornerSquareType: CornerSquareType;
  cornerSquareColor: string;
  cornerDotType: CornerDotType;
  cornerDotColor: string;
  dotType: DotType;
  dotColor: string;
  shape: ShapeType;
}

const ConfigSelect = (props: {
  readonly settingKey: keyof QrCodeSettings;
  readonly name: string;
  readonly types:
    | DotType[]
    | CornerDotType[]
    | CornerSquareType[]
    | ShapeType[];
  readonly settings: QrCodeSettings;
  readonly setSettings: (settings: QrCodeSettings) => void;
}) => {
  const onChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) =>
      props.setSettings({
        ...props.settings,
        [props.settingKey]: event.target.value as DotType,
      }),
    [props],
  );
  const { t } = useToolboxTranslation();
  const classes = useStyles();

  const colorSetting = props.settingKey.replace(
    'Type',
    'Color',
  ) as keyof QrCodeSettings;
  const onChangeColor = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      props.setSettings({
        ...props.settings,
        [colorSetting]: event.target.value as DotType,
      }),
    [colorSetting, props],
  );

  return (
    <FormControl key={`formcontrol-for-select-${props.settingKey}`}>
      <DefaultSelect
        id={`id-${props.settingKey}`}
        key={`select-for-${props.settingKey}`}
        label={props.name}
        onChange={onChange}
        className={classes.select}
        value={props.settings[props.settingKey]}
      >
        {props.types
          ? props.types.map(value => (
              <MenuItem
                key={`selectFor${props.name}menu${value}`}
                value={value}
              >
                {t(`tool.qr-code-generate.${value}`)}
              </MenuItem>
            ))
          : null}
      </DefaultSelect>
      {props.name !== 'Shape' ? (
        <TextField
          defaultValue={props.settings[colorSetting]}
          id="input"
          label={`${props.name} ${t('tool.qr-code-generate.color')}`}
          name="input"
          onChange={onChangeColor}
          className={classes.colorTextField}
          variant="standard"
        />
      ) : null}
    </FormControl>
  );
};

export const QRCodeGenerator = () => {
  const [input, setInput] = useState('');
  const sample = faker.internet.url();

  const [fileExt, setFileExt] = useState<FileExtension>('png');
  const [image, setImage] = useState<string | null>(null);
  const ref = useRef(null);
  const { t } = useToolboxTranslation();
  const classes = useStyles();

  const config = useApi(configApiRef).getOptionalConfig('app.toolbox.qrCode');

  const defaultColor = '#000';
  const defaults: QrCodeSettings = {
    cornerSquareType:
      (config?.getOptionalString(
        'defaults.cornerSquareType',
      ) as CornerSquareType) ?? 'square',
    cornerSquareColor:
      config?.getOptionalString('defaults.cornerSquareColor') ?? defaultColor,
    cornerDotType:
      (config?.getOptionalString('defaults.cornerDotType') as CornerDotType) ??
      'square',
    cornerDotColor:
      config?.getOptionalString('defaults.cornerDotColor') ?? defaultColor,
    dotType:
      (config?.getOptionalString('defaults.dotType') as DotType) ?? 'square',
    dotColor: config?.getOptionalString('defaults.dotColor') ?? defaultColor,
    shape:
      (config?.getOptionalString('defaults.shape') as ShapeType) ?? 'square',
  };

  // settings
  const [settings, setSettings] = useState<QrCodeSettings>(defaults);

  const qrCode = useMemo(() => {
    const qr = new QRCodeStyling({
      width: 500,
      height: 500,
      image: '',
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
        crossOrigin: 'anonymous',
        margin: 20,
      },
      margin: 5,
    });

    if (ref.current) {
      qr.append(ref.current);
    }
    return qr;
  }, [
    settings.cornerDotColor,
    settings.cornerDotType,
    settings.cornerSquareColor,
    settings.cornerSquareType,
    settings.dotColor,
    settings.dotType,
    settings.shape,
  ]);

  useEffect(() => {
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
    qrCode
      .getRawData()
      .then(data => {
        if (!data) {
          setImage(null);
          return;
        }

        if (Buffer.isBuffer(data)) {
          const blob = new Blob([data as BlobPart], { type: 'image/png' });
          setImage(window.URL.createObjectURL(blob));
          return;
        }

        setImage(window.URL.createObjectURL(data));
      })
      .catch(() => setImage(null));
  }, [qrCode, settings, input]);

  const onExtensionChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setFileExt(event.target.value as FileExtension);
    },
    [setFileExt],
  );

  const onDownloadClick = useCallback(() => {
    void qrCode.download({
      extension: fileExt,
    });
  }, [fileExt, qrCode]);

  const DownloadOptions = (
    <span className={classes.downloadSpan}>
      <FormControl>
        <DefaultSelect
          defaultValue="png"
          label={t('tool.qr-code-generate.downloadAs')}
          onChange={onExtensionChange}
        >
          <MenuItem value="png">png</MenuItem>
          <MenuItem value="webp">webp</MenuItem>
          <MenuItem value="jpeg">jpeg</MenuItem>
          <MenuItem value="svg">svg</MenuItem>
        </DefaultSelect>
      </FormControl>
      <Button key="downloadbutton" onClick={onDownloadClick} disabled={!input}>
        {t('tool.qr-code-generate.download')}
      </Button>
    </span>
  );

  return (
    <>
      <Box className={classes.box} />

      <DefaultEditor
        additionalTools={[
          <ConfigSelect
            key="dotSelect"
            name={t('tool.qr-code-generate.dotType')}
            setSettings={setSettings}
            settingKey={'dotType' as const}
            settings={settings}
            types={
              [
                'square',
                'classy',
                'dots',
                'classy-rounded',
                'extra-rounded',
                'rounded',
              ] as DotType[]
            }
          />,
          <ConfigSelect
            key="cornerSquareSelect"
            name={t('tool.qr-code-generate.cornerSquareType')}
            setSettings={setSettings}
            settingKey={'cornerSquareType' as const}
            settings={settings}
            types={['square', 'dot', 'extra-rounded'] as CornerSquareType[]}
          />,
          <ConfigSelect
            key="cornerDotSelect"
            name={t('tool.qr-code-generate.cornerDotType')}
            setSettings={setSettings}
            settingKey={'cornerDotType' as const}
            settings={settings}
            types={['dot', 'square'] as CornerDotType[]}
          />,
          <ConfigSelect
            key="shapeSelect"
            name={t('tool.qr-code-generate.shapeType')}
            setSettings={setSettings}
            settingKey={'shape' as const}
            settings={settings}
            types={['circle', 'square'] as ShapeType[]}
          />,
          DownloadOptions,
        ]}
        input={input}
        inputProps={{ maxLength: 2048 }}
        rightContent={
          image ? (
            <img
              ref={ref}
              className="blob-to-image"
              src={image}
              alt="QR code"
            />
          ) : (
            <div ref={ref} />
          )
        }
        sample={sample}
        setInput={useCallback(
          value => {
            setInput(value);
          },
          [setInput],
        )}
      />
    </>
  );
};
export default QRCodeGenerator;
