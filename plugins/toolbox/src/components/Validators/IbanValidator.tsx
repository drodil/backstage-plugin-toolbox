import { useEffect, useState } from 'react';
import * as IBAN from 'iban';
import { DefaultEditor } from '../DefaultEditor';
import { OutputField } from '../DefaultEditor/OutputField';
import { Alert } from '@backstage/ui';
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
      inputLabel="IBAN"
      rightContent={
        <>
          {!isValid && (
            <Alert
              status="danger"
              title={t('tool.iban.alertErrorTitle')}
              description={t('tool.iban.alertInvalidIBAN')}
            />
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
