import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export const PznValidator = () => {
  const [input, setInput] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

    function isPznValid(str: string) {
      let complete = 0;
      for (let i = 0; i < str.length - 1; i++) {
        const num = parseInt(String(str.charAt(i)), 10);
        complete += num * (i + 1);
      }
      const quot = Math.floor(complete / 11);
      const mod = Number(complete - quot * 11);
      const last = parseInt(String(str.charAt(str.length - 1)), 10);
      // console.log("pzn= " + str + " quot=" + quot + " mod= " + mod + " last=" + last);
      return mod === last;
    }

    useEffect(() => {
    let valid = true;
    try {
      // checksum number is used to detect typos in PZN numbers.
      // it is calculated as modulo 11 of the sum of each ongoing digit of the number: (digit0 * 1) + (digit1 * 2) + (digit2 * 3) and so on
      // example:
      // validation: PZN - 0345874 5
      // sum: 0*1 + 3*2 + 4*3 + 5*4 + 8*5 + 7*6 + 4*7 = 148
      // quotient: 148 : 11 = 13
      // modulo 11: 148 - (13*11) = 5
     valid = isPznValid(input);
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
      inputLabel="PZN"
      rightContent={
        <>
          {!isValid && (
            <Alert severity="error">
              <AlertTitle>Error!</AlertTitle>
              Invalid PZN provided, empty input, input not numeric or input length not 8 characters.
            </Alert>
          )}
            {isValid && (
                <Alert severity="info">
                    <AlertTitle>Cool!</AlertTitle>
                    Valid PZN provided.
                </Alert>
            )}
        </>
      }
      sample="03458745"
    />
  );
};

export default PznValidator;
