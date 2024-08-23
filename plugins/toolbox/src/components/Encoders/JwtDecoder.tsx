import React, { useCallback, useEffect } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { DefaultEditor } from '../DefaultEditor';
import { SignJWT } from 'jose';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useToolboxTranslation } from '../../hooks';

const BASE64_REGEX =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export const JwtDecoder = () => {
  const alertApi = useApi(alertApiRef);
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Encode');
  const { t } = useToolboxTranslation();

  const exampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';
  const exampleJSON = {
    header: {
      alg: 'HS256',
      typ: 'JWT',
    },
    payload: {
      sub: 1234567890,
      iat: 1516239022,
      iss: 'John Doe',
      exp: 1516239022,
    },
    key: 'exampleSecretKey',
  };

  const showError = useCallback(
    attribute => {
      const errorMessage = t(`tool.jwt-decoder-encode.missingAttribute`, {
        attribute,
      });
      setOutput(errorMessage);
      alertApi.post({
        message: errorMessage,
        severity: 'error',
        display: 'transient',
      });
      return false;
    },
    [t, alertApi],
  );

  const keyExists = useCallback(
    json => {
      if (!('key' in json)) {
        return showError('key');
      }
      return true;
    },
    [showError],
  );

  const payloadExists = useCallback(
    json => {
      if (!('payload' in json)) {
        return showError('payload');
      }
      if (!('iat' in json.payload)) {
        return showError('payload.iat');
      }
      if (!('iss' in json.payload)) {
        return showError('payload.iss');
      }
      if (!('exp' in json.payload)) {
        return showError('payload.exp');
      }
      return true;
    },
    [showError],
  );

  const headerExists = useCallback(
    json => {
      if (!('header' in json)) {
        return showError('header');
      }
      if (!('alg' in json.header)) {
        return showError('header.alg');
      }
      return true;
    },
    [showError],
  );

  useEffect(() => {
    if (mode === 'Decode') {
      let value = input;
      if (BASE64_REGEX.test(value)) {
        value = atob(value);
      }

      try {
        const jwtPayload = jwtDecode<JwtPayload>(value);
        setOutput(`Issued date:
${jwtPayload.iat && new Date(jwtPayload.iat * 1000)}

Expiration date:
${jwtPayload.exp && new Date(jwtPayload.exp * 1000)}

Header:
${JSON.stringify(jwtDecode(input, { header: true }), null, 2)}

Payload:
${JSON.stringify(jwtPayload, null, 2)}`);
      } catch (error) {
        setOutput(t('tool.jwt-decoder-encode.decodeError', { error }));
      }
    } else {
      try {
        const inputJSON = JSON.parse(input);
        if (
          keyExists(inputJSON) &&
          payloadExists(inputJSON) &&
          headerExists(inputJSON)
        ) {
          const secret = new TextEncoder().encode(inputJSON.key);
          (async () => {
            const token = await new SignJWT(inputJSON.payload)
              .setProtectedHeader(inputJSON.header)
              .setIssuedAt(inputJSON.payload.iat)
              .setIssuer(inputJSON.payload.iss)
              .setExpirationTime(inputJSON.payload.exp)
              .sign(secret);
            setOutput(token);
          })();
        }

        if (!('header' in inputJSON)) {
          const errorMessage = t(`tool.jwt-decoder-encode.missingAttribute`, {
            attribute: 'header',
          });
          setOutput(errorMessage);
        }
      } catch (error) {
        setOutput(t('tool.jwt-decoder-encode.encodeError', { error }));
      }
    }
  }, [input, mode, headerExists, keyExists, payloadExists, t]);

  return (
    <DefaultEditor
      input={input}
      mode={mode}
      setInput={setInput}
      setMode={setMode}
      modes={['Encode', 'Decode']}
      sample={
        mode === 'Encode' ? JSON.stringify(exampleJSON, null, 4) : exampleJwt
      }
      output={output}
    />
  );
};

export default JwtDecoder;
