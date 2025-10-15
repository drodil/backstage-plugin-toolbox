import { useEffect, useState } from 'react';
import * as IBAN from 'iban';
import { DefaultEditor } from '../DefaultEditor';
import { OutputField } from '../DefaultEditor/OutputField';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useToolboxTranslation } from '../../hooks';

export const IbanValidator = () => {
  const [input, setInput] = useState('');
  const [bban, setBban] = useState('');
  const [electronic, setElectronic] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { t } = useToolboxTranslation();

  useEffect(() => {
    let valid: boolean;
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
              <AlertTitle>{t('tool.iban.alertErrorTitle')}</AlertTitle>
              {t('tool.iban.alertInvalidIBAN')}
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
