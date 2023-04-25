import React, { useEffect } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { DefaultEditor } from '../DefaultEditor';

export const JwtDecoder = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const exampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';

  useEffect(() => {
    if (input) {
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
    }
  }, [input]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      sample={exampleJwt}
      output={output}
    />
  );
};

export default JwtDecoder;
