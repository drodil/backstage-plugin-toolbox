import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { DefaultEditor } from '../DefaultEditor';

export const JwtDecoder = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const exampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';

  useEffect(() => {
    if (input) {
      try {
        const jwtPayload = jwtDecode(input) as { iat?: number; exp?: number };
        setOutput(`Issued date:
${jwtPayload.iat && new Date(jwtPayload.iat)}

Expiration date:
${jwtPayload.exp && new Date(jwtPayload.exp)}

Header:
${JSON.stringify(jwtDecode(input, { header: true }), null, 2)}

Payload:
${JSON.stringify(jwtPayload, null, 2)}`);
      } catch (error) {
        setOutput("couldn't decode JWT token...");
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
