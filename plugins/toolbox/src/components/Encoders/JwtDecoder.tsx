import React, { useEffect } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { DefaultEditor } from '../DefaultEditor';
import { SignJWT } from 'jose';

export const JwtDecoder = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [mode, setMode] = React.useState('Encode');

  const exampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';
  const exampleJSON = {
    header: {
      alg: 'HS256',
      typ: 'JWT'
    },
    payload: {
      sub: 1234567890,
      iat: 1516239022,
      iss: 'John Doe',
      exp: 1516239022
    },
    key: "exampleSecretKey"
  };
  
  useEffect(() => {
    if (mode === 'Decode') {
      try {
        const jwtPayload = jwtDecode<JwtPayload>(input);
        setOutput(`Issued date:
${jwtPayload.iat && new Date(jwtPayload.iat * 1000)}

Expiration date:
${jwtPayload.exp && new Date(jwtPayload.exp * 1000)}

Header:
${JSON.stringify(jwtDecode(input, { header: true }), null, 2)}

Payload:
${JSON.stringify(jwtPayload, null, 2)}`);
      } catch (error) {
        setOutput(`Couldn't decode JWT token: ${error}`);
      }
    } else {
      try {
        const inputJSON = JSON.parse(input);
        const secret = new TextEncoder().encode(inputJSON.key);
        (async () => { 
          const token =  await new SignJWT(inputJSON.payload)
          .setProtectedHeader(inputJSON.header)
          .setIssuedAt(inputJSON.payload.iat)
          .setIssuer(inputJSON.payload.iss)
          .setExpirationTime(inputJSON.payload.exp)
          .sign(secret);
        setOutput(token);
        })();
      }
      catch (error) {
        setOutput(`Couldn't encode JWT token: ${error}`);
      }
    }
  }, [input, mode]);

  return (
    <DefaultEditor
      input={input}
      mode={mode}
      setInput={setInput}
      setMode={setMode}
      modes={['Encode', 'Decode']}
      sample={mode === 'Encode' ? JSON.stringify(exampleJSON, null, 4) : exampleJwt}
      output={output}
    />
  );
};

export default JwtDecoder;
