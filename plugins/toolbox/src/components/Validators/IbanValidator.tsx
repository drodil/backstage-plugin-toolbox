import React, { useEffect } from 'react';
import * as IBAN from 'iban';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { OutputField } from '../DefaultEditor/OutputField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export const IbanValidator = () => {
  const [input, setInput] = React.useState('');
  const [bban, setBban] = React.useState('');
  const [electronic, setElectronic] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  useEffect(() => {
    let valid = true;
    try {
      valid = IBAN.isValid(input);
      setBban(IBAN.toBBAN(input));
      setElectronic(IBAN.electronicFormat(input));
    } catch (error) {
      valid = false;
    }
    setIsValid(valid);
  }, [input]);

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      minRows={1}
      inputLabel="IBAN"
      rightContent={
        <>
          {!isValid && (
            <Alert severity="error">
              <AlertTitle>Error!</AlertTitle>
              Invalid IBAN provided
            </Alert>
          )}
          {isValid && (
            <>
              <OutputField label="BBAN" value={bban} />
              <OutputField label="Electronic" value={electronic} />
            </>
          )}
        </>
      }
      sample="BE68539007547034"
    />
  );
};

export default IbanValidator;
