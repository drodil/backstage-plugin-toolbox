import * as React from 'react';
import { ChangeEvent, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { alertApiRef, configApiRef, useApi } from '@backstage/core-plugin-api';
import { useToolboxTranslation } from '../../hooks';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';
import { FileDownloadButton } from '../Buttons/FileDownloadButton';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import * as asn1js from 'asn1js';
import {
  Attribute,
  AttributeTypeAndValue,
  CertificationRequest,
  Extension,
  Extensions,
  GeneralName,
  GeneralNames,
  RelativeDistinguishedNames,
} from 'pkijs/build';
import { getCrypto } from 'pkijs';

const keyOptions = [
  { label: 'RSA 4096', value: 'rsa-4096-sha2' },
  { label: 'ECDSA p384', value: 'ecdsa-p384' },
  { label: 'ECDSA p256', value: 'ecdsa-p256' },
  { label: '⚠️RSA 2048 (SHA1 - Legacy systems only)', value: 'rsa-2048-sha1' },
];

export const CSRGenerator = () => {
  const { t } = useToolboxTranslation();
  const [fqdns, setFqdns] = React.useState<string[]>([]);
  const [hashAlgName, setHashAlgName] = React.useState('SHA-256');
  const [keyPEM, setKeyPEM] = React.useState('');
  const [key, setKey] = React.useState<CryptoKeyPair | undefined>(undefined);
  const [certReq, setCertReq] = React.useState('');
  const [decodedCSR, setDecodedCSR] = React.useState('');
  const [algorithmName, setAlgorithmName] = React.useState('rsa-4096-sha2');
  const alertApi = useApi(alertApiRef);
  const config = useApi(configApiRef);
  const [subjectValues, setSubjectValues] = React.useState({
    country: config.getOptionalString('app.toolbox.csr.defaults.country') || '',
    state: config.getOptionalString('app.toolbox.csr.defaults.state') || '',
    locality:
      config.getOptionalString('app.toolbox.csr.defaults.locality') || '',
    organization:
      config.getOptionalString('app.toolbox.csr.defaults.organization') || '',
  });

  useEffect(() => {
    setKeyPEM('');
    setKey(undefined);
    setCertReq('');

    if (algorithmName.endsWith('sha1')) {
      setHashAlgName('SHA-1');
    } else if (algorithmName === 'ecdsa-p384') {
      setHashAlgName('SHA-384');
    } else {
      setHashAlgName('SHA-256');
    }

    generateNewKeyPair(algorithmName).then((kp: CryptoKeyPair) => {
      getPrivateKeyPEM(kp).then(privatePEM => {
        setKey(kp);
        setKeyPEM(privatePEM);
      });
    });
  }, [algorithmName]);

  const handleSubjectChange =
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setSubjectValues({ ...subjectValues, [field]: event.target.value });
    };

  const handleAlgorithmChange = (
    _event: React.ChangeEvent<{}>,
    newAlgorithm: { label: string; value: string } | null,
  ) => {
    if (newAlgorithm) {
      setAlgorithmName(newAlgorithm.value);
    }
  };

  const handleFqdnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const fqdnz = event.target.value
      .split(/[\n\s,]+/)
      .map(fqdn => fqdn.trim())
      .filter(fqdn => fqdn.length > 0);
    setFqdns(fqdnz);
    setCertReq('');
  };

  const handleSubmit = async () => {
    if (fqdns.length === 0) {
      alertApi.post({
        message: t('tool.csr-generate.alertMsg'),
        severity: 'info',
      });
      return;
    }
    setCertReq('');
    createCSR(key, hashAlgName, fqdns, subjectValues)
      .then(csr => {
        setCertReq(csr);
        handleDecodeCSR(csr, setDecodedCSR);
      })
      .catch(() => {
        alertApi.post({
          message: t('tool.csr-generate.errorMsg'),
          severity: 'error',
        });
        return;
      });
  };

  return (
    <FormControl style={{ width: '100%' }}>
      <Grid container spacing={4} style={{ marginBottom: '5px' }}>
        <Grid item sx={{ pl: '16px', pt: '32px !important' }}>
          <ButtonGroup
            size="small"
            style={{ marginBottom: '1rem' }}
            color="inherit"
          >
            <Button
              startIcon={<PlayCircleOutlineRoundedIcon />}
              onClick={handleSubmit}
              size="small"
              variant="text"
              color="inherit"
            >
              {t('tool.csr-generate.generateButton')}
            </Button>
            <CopyToClipboardButton output={certReq} />
            <p style={{ fontWeight: 500, fontFamily: 'Helvetica Neue' }}>CSR</p>
            <FileDownloadButton
              content={keyPEM}
              fileName={`${fqdns[0]}.${algorithmName}.key`}
              fileType="text/plain"
            />
            <p style={{ fontWeight: 500, fontFamily: 'Helvetica Neue' }}>
              {t('tool.csr-generate.key')}
            </p>
          </ButtonGroup>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={12}
            lg={4}
            sx={{ pt: '8px !important', pl: '8px !important' }}
          >
            <TextField
              label={t('tool.csr-generate.domainNamesLabel')}
              onChange={handleFqdnChange}
              multiline
              minRows={5}
              style={{ marginBottom: '10px', width: '100%' }}
              InputProps={{
                style: { whiteSpace: 'pre-wrap' },
              }}
            />
            <Autocomplete
              style={{ marginBottom: '10px', width: '100%' }}
              options={keyOptions}
              value={
                keyOptions.find(option => option.value === algorithmName) ||
                null
              }
              onChange={handleAlgorithmChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('tool.csr-generate.keyTypeLabel')}
                  variant="outlined"
                />
              )}
            />
            <TextField
              label={t('tool.csr-generate.countryNameLabel')}
              value={subjectValues.country}
              style={{ marginBottom: '10px', width: '100%' }}
              onChange={handleSubjectChange('country')}
            />
            <TextField
              label={t('tool.csr-generate.stateOrProvinceNameLabel')}
              value={subjectValues.state}
              style={{ marginBottom: '10px', width: '100%' }}
              onChange={handleSubjectChange('state')}
            />
            <TextField
              label={t('tool.csr-generate.localityNameLabel')}
              value={subjectValues.locality}
              style={{ marginBottom: '10px', width: '100%' }}
              onChange={handleSubjectChange('locality')}
            />
            <TextField
              label={t('tool.csr-generate.organizationNameLabel')}
              value={subjectValues.organization}
              style={{ marginBottom: '10px', width: '100%' }}
              onChange={handleSubjectChange('organization')}
            />
          </Grid>
          <Grid item xs={12} lg={8} sx={{ p: '8px !important' }}>
            <TextField
              id="certificate-request"
              label={t('tool.csr-generate.certificateRequestLabel')}
              value={certReq || ''}
              style={{ width: '100%', marginBottom: '10px' }}
              multiline
              minRows={20}
              maxRows={50}
              variant="outlined"
              InputProps={{
                style: { whiteSpace: 'pre-wrap' },
                readOnly: true,
              }}
            />
            <TextField
              id="decoded-csr"
              label={t('tool.csr-generate.decodedCSRLabel')}
              value={decodedCSR || ''}
              style={{ width: '100%' }}
              multiline
              minRows={10}
              maxRows={20}
              variant="outlined"
              InputProps={{
                style: { whiteSpace: 'pre-wrap' },
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormControl>
  );
};

async function generateNewKeyPair(
  algorithmName: string,
): Promise<CryptoKeyPair> {
  const crypto = getCrypto(true);
  if (algorithmName.startsWith('ecdsa-')) {
    let modLen = 256;
    if (algorithmName === 'ecdsa-p384') {
      modLen = 384;
    }
    const keyspec = {
      name: 'ecdsa',
      namedCurve: `P-${modLen}`,
    };
    return crypto.generateKey(keyspec, true, ['sign', 'verify']);
  } else if (algorithmName.startsWith('rsa-')) {
    let modLen = 4096;
    let hashAlgName = 'SHA-256';
    if (algorithmName === 'rsa-2048-sha1') {
      hashAlgName = 'SHA-1';
      modLen = 2048;
    }
    const keyspec = {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: modLen,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: hashAlgName },
    };
    return crypto.generateKey(keyspec, true, ['sign', 'verify']);
  }
  throw new Error(`Unknown algorithm: ${algorithmName}`);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

async function getPrivateKeyPEM(kp: CryptoKeyPair): Promise<string> {
  if (typeof kp === 'undefined') {
    throw new Error('No keypair generated');
  }
  const crypto = getCrypto(true);
  const exported = await crypto.exportKey('pkcs8', kp.privateKey);
  return `-----BEGIN \x50RIVATE \x4BEY-----\n${arrayBufferToBase64(
    exported,
  ).replace(/(.{64})/g, '$1\n')}\n-----END \x50RIVATE \x4BEY-----`;
}

async function createCSR(
  kp: CryptoKeyPair | undefined,
  hashAlgName: string,
  fqdns: string[],
  subjectValues: {
    country: string;
    state: string;
    locality: string;
    organization: string;
  },
): Promise<string> {
  if (typeof kp === 'undefined') {
    throw new Error('No keypair available');
  }
  if (fqdns.length === 0 || fqdns[0] === '') {
    throw new Error('Provide some domain names first');
  }

  const pkcs10 = new CertificationRequest();
  pkcs10.version = 0;

  const subjectAttributes = [
    new AttributeTypeAndValue({
      type: '2.5.4.6',
      value: new asn1js.PrintableString({ value: subjectValues.country }),
    }),
    new AttributeTypeAndValue({
      type: '2.5.4.8',
      value: new asn1js.Utf8String({ value: subjectValues.state }),
    }),
    new AttributeTypeAndValue({
      type: '2.5.4.7',
      value: new asn1js.Utf8String({ value: subjectValues.locality }),
    }),
    new AttributeTypeAndValue({
      type: '2.5.4.10',
      value: new asn1js.Utf8String({ value: subjectValues.organization }),
    }),
    new AttributeTypeAndValue({
      type: '2.5.4.3',
      value: new asn1js.Utf8String({ value: fqdns[0] }),
    }),
  ];

  const subject = new RelativeDistinguishedNames({
    typesAndValues: subjectAttributes,
  });

  const subjectSchema = new asn1js.Sequence({
    value: subjectAttributes.map(
      attr => new asn1js.Set({ value: [attr.toSchema()] }),
    ),
  });
  subject.toSchema = function toSchema() {
    return subjectSchema;
  };
  pkcs10.subject = subject;

  const altNames = new GeneralNames({
    names: fqdns.map(x => new GeneralName({ type: 2, value: x })),
  });

  pkcs10.attributes = [
    new Attribute({
      type: '1.2.840.113549.1.9.14', // OID for Extension Request
      values: [
        new Extensions({
          extensions: [
            new Extension({
              extnID: '2.5.29.17', // OID for Subject Alternative Name, allows multiple domain names or IPs
              critical: false,
              extnValue: altNames.toSchema().toBER(false),
            }),
          ],
        }).toSchema(),
      ],
    }),
  ];

  if (typeof kp !== 'undefined') {
    try {
      // Import the public key into the PKCS#10 structure
      await pkcs10.subjectPublicKeyInfo.importKey(kp.publicKey);
      const ha = hashAlgName || 'SHA-256';
      // Sign the PKCS#10 CSR with the private key
      await pkcs10.sign(kp.privateKey, ha);
      const ber = pkcs10.toSchema().toBER(false);
      return `-----BEGIN CERTIFICATE REQUEST-----\n${arrayBufferToBase64(
        ber,
      ).replace(/(.{64})/g, '$1\n')}\n-----END CERTIFICATE REQUEST-----`.trim();
    } catch (error) {
      throw new Error(`Failed to create CSR: ${error.message}`);
    }
  }
  throw new Error('No key pair available to create CSR');
}

function decodeCSR(csrPEM: string): string {
  try {
    const base64Csr = csrPEM.replace(
      /-----BEGIN CERTIFICATE REQUEST-----|-----END CERTIFICATE REQUEST-----|\n/g,
      '',
    );
    const csrBuffer = Uint8Array.from(atob(base64Csr), c =>
      c.charCodeAt(0),
    ).buffer;
    const csr = new CertificationRequest({
      schema: asn1js.fromBER(csrBuffer).result,
    });
    const subjectInfo = csr.subject.typesAndValues
      .map(attr => {
        return `${attr.type}: ${attr.value.valueBlock.value}`;
      })
      .join('\n');
    const publicKeyInfo = csr.subjectPublicKeyInfo;
    let publicKeyType;
    let publicKeySize = 0;
    switch (publicKeyInfo.algorithm.algorithmId) {
      case '1.2.840.113549.1.1.1': {
        // OID for RSA
        publicKeyType = 'RSA';
        if (publicKeyInfo.parsedKey && 'modulus' in publicKeyInfo.parsedKey) {
          publicKeySize =
            publicKeyInfo.parsedKey.modulus.valueBlock.valueHex.byteLength *
              8 || 0;
        }

        break;
      }
      case '1.2.840.10045.2.1': {
        // OID for ECDSA
        publicKeyType = 'ECDSA';
        const namedCurve =
          publicKeyInfo.algorithm.algorithmParams.valueBlock.toString();
        const curveMap: Record<string, number> = {
          '1.2.840.10045.3.1.7': 256, // OID for P-256
          '1.3.132.0.34': 384, // OID for P-384
          '1.3.132.0.35': 521, // OID for P-521
        };
        publicKeySize = curveMap[namedCurve] || 0;
        break;
      }
      default: {
        publicKeyType = 'Unknown';
        break;
      }
    }

    let sanInfo = 'No SAN found';
    const extAttr = csr.attributes
      ? csr.attributes.find(attr => attr.type === '1.2.840.113549.1.9.14') // OID for Extension Request
      : undefined;
    if (extAttr) {
      const extensions = new Extensions({ schema: extAttr.values[0] });
      const sanExt = extensions.extensions.find(
        ext => ext.extnID === '2.5.29.17', // OID for Subject Alternative Name
      );
      if (sanExt) {
        const generalNames = new GeneralNames({
          schema: asn1js.fromBER(sanExt.extnValue.valueBlock.valueHex).result,
        });
        sanInfo = generalNames.names.map(name => name.value).join(', ');
      }
    }

    let signatureAlgorithm;
    switch (csr.signatureAlgorithm.algorithmId) {
      case '1.2.840.113549.1.1.5': // OID for SHA-1 with RSA
        signatureAlgorithm = 'SHA-1 with RSA';
        break;
      case '1.2.840.113549.1.1.11': // OID for SHA-256 with RSA
        signatureAlgorithm = 'SHA-256 with RSA';
        break;
      case '1.2.840.113549.1.1.12': // OID for SHA-384 with RSA
        signatureAlgorithm = 'SHA-384 with RSA';
        break;
      case '1.2.840.113549.1.1.13': // OID for SHA-512 with RSA
        signatureAlgorithm = 'SHA-512 with RSA';
        break;
      case '1.2.840.10045.4.3.2': // OID for SHA-256 with ECDSA
        signatureAlgorithm = 'SHA-256 with ECDSA';
        break;
      case '1.2.840.10045.4.3.3': // OID for SHA-384 with ECDSA
        signatureAlgorithm = 'SHA-384 with ECDSA';
        break;
      case '1.2.840.10045.4.3.4': // OID for SHA-512 with ECDSA
        signatureAlgorithm = 'SHA-512 with ECDSA';
        break;
      default:
        signatureAlgorithm = `Unknown${csr.signatureAlgorithm.algorithmId}`;
        break;
    }
    return `Subject:\n${subjectInfo}\n\nPublic Key:\nType: ${publicKeyType} \nSize: ${publicKeySize} bits\n \nSubject Alternative Names:\n${sanInfo}\n\nSignature Algorithm:\n${signatureAlgorithm}`;
  } catch (error) {
    throw new Error('Invalid CSR or failed to parse.', { cause: error });
  }
}

function handleDecodeCSR(
  csrPEM: string,
  setDecodedCSR: (value: string) => void,
) {
  try {
    const decoded = decodeCSR(csrPEM);
    setDecodedCSR(decoded);
  } catch (error) {
    throw new Error('Failed to decode CSR.', { cause: error });
  }
}

export default CSRGenerator;
