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

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useToolboxTranslation } from '../../hooks';
import { DefaultEditor } from '../DefaultEditor';
import { Button, Select, TextField } from '@backstage/ui';

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
  const { t } = useToolboxTranslation();
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
    <div
      key={`formcontrol-for-select-${props.settingKey}`}
      style={{ margin: '0 10px' }}
    >
      <Select
        id={`id-${props.settingKey}`}
        label={props.name}
        selectedKey={props.settings[props.settingKey]}
        onSelectionChange={key =>
          props.setSettings({
            ...props.settings,
            [props.settingKey]: key as DotType,
          })
        }
        options={
          props.types
            ? props.types.map(value => ({
                value,
                label: t(`tool.qr-code-generate.${value}`, {
                  defaultValue: value,
                }),
              }))
            : []
        }
      />
      {props.name !== 'Shape' ? (
        <TextField
          label={`${props.name} ${t('tool.qr-code-generate.color')}`}
          defaultValue={props.settings[colorSetting]}
          onChange={(val: any) =>
            onChangeColor({ target: { value: val } } as any)
          }
          autoComplete="off"
        />
      ) : null}
    </div>
  );
};

export const QRCodeGenerator = () => {
  const [input, setInput] = useState('');
  const sample = faker.internet.url();
  const [fileExt, setFileExt] = useState<FileExtension>('png');
  const [image, setImage] = useState<string | null>(null);
  const ref = useRef(null);
  const { t } = useToolboxTranslation();

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
  const [settings, setSettings] = useState<QrCodeSettings>(defaults);

  const qrCode = useMemo(() => {
    const qr = new QRCodeStyling({
      width: 500,
      height: 500,
      image: '',
      dotsOptions: { color: settings.dotColor, type: settings.dotType },
      cornersSquareOptions: {
        color: settings.cornerSquareColor,
        type: settings.cornerSquareType,
      },
      cornersDotOptions: {
        color: settings.cornerDotColor,
        type: settings.cornerDotType,
      },
      shape: settings.shape,
      imageOptions: { crossOrigin: 'anonymous', margin: 20 },
      margin: 5,
    });
    if (ref.current) qr.append(ref.current);
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
    qrCode.update({ data: input });
    qrCode.update({
      cornersSquareOptions: {
        color: settings.cornerSquareColor,
        type: settings.cornerSquareType,
      },
      cornersDotOptions: {
        color: settings.cornerDotColor,
        type: settings.cornerDotType,
      },
      dotsOptions: { color: settings.dotColor, type: settings.dotType },
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

  const onDownloadClick = useCallback(() => {
    void qrCode.download({ extension: fileExt });
  }, [fileExt, qrCode]);

  const DownloadOptions = (
    <span style={{ marginLeft: '2rem' }}>
      <Select
        label={t('tool.qr-code-generate.downloadAs')}
        selectedKey={fileExt}
        onSelectionChange={key => setFileExt(key as FileExtension)}
        options={[
          { value: 'png', label: 'png' },
          { value: 'webp', label: 'webp' },
          { value: 'jpeg', label: 'jpeg' },
          { value: 'svg', label: 'svg' },
        ]}
      />
      <Button
        key="downloadbutton"
        onClick={onDownloadClick}
        isDisabled={!input}
        variant="primary"
      >
        {t('tool.qr-code-generate.download')}
      </Button>
    </span>
  );

  return (
    <DefaultEditor
      additionalTools={[
        <ConfigSelect
          key="dotSelect"
          name={t('tool.qr-code-generate.dotType')}
          setSettings={setSettings}
          settingKey="dotType"
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
          settingKey="cornerSquareType"
          settings={settings}
          types={['square', 'dot', 'extra-rounded'] as CornerSquareType[]}
        />,
        <ConfigSelect
          key="cornerDotSelect"
          name={t('tool.qr-code-generate.cornerDotType')}
          setSettings={setSettings}
          settingKey="cornerDotType"
          settings={settings}
          types={['dot', 'square'] as CornerDotType[]}
        />,
        <ConfigSelect
          key="shapeSelect"
          name={t('tool.qr-code-generate.shapeType')}
          setSettings={setSettings}
          settingKey="shape"
          settings={settings}
          types={['circle', 'square'] as ShapeType[]}
        />,
        DownloadOptions,
      ]}
      input={input}
      inputProps={{ maxLength: 2048 }}
      rightContent={
        image ? (
          <img ref={ref} className="blob-to-image" src={image} alt="QR code" />
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
  );
};

export default QRCodeGenerator;
