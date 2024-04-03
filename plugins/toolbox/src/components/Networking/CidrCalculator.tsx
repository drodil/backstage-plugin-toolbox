/**
 * This is disabled for now, fails to build the Backstage app for some reason
 * ERROR: Big integer literals are not available in the configured target environment ("es2019")
 * FIXME.
import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
 import TextField from '@mui/material/TextField';
import { useStyles } from '../../utils/hooks';
import { faker } from '@faker-js/faker';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';
import { IPv4CidrRange, IPv6CidrRange, Validator } from 'ip-num';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export const CidrCalculator = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [cidr, setCidr] = React.useState({
    firstIp4: '',
    lastIp4: '',
    firstIp6: '',
    lastIp6: '',
    size: '',
    nextRange: '',
    previousRange: '',
  });
  const sample = `${faker.internet.ipv4()}/${Math.floor(Math.random() * 33)}`;

  useEffect(() => {
    const [validIp4, errIp4] = Validator.isValidIPv4CidrNotation(input);
    const [validIp6, errIp6] = Validator.isValidIPv6CidrNotation(input);
    if (!validIp4 && !validIp6) {
      if (!validIp4) {
        setError(errIp4.join('<br/>'));
        return;
      }
      setError(errIp6.join('<br/>'));
      return;
    }

    setError(null);
    if (validIp4) {
      const cidrIp4 = IPv4CidrRange.fromCidr(input);
      setCidr({
        firstIp4: cidrIp4.getFirst().toString(),
        lastIp4: cidrIp4.getLast().toString(),
        firstIp6: cidrIp4.getFirst().toIPv4MappedIPv6().toString(),
        lastIp6: cidrIp4.getLast().toIPv4MappedIPv6().toString(),
        size: cidrIp4.getSize().toString(),
        nextRange: cidrIp4.nextRange()?.toCidrString() ?? 'No next range',
        previousRange:
          cidrIp4.previousRange()?.toCidrString() ?? 'No previous range',
      });
    } else if (validIp6) {
      const cidrIp6 = IPv6CidrRange.fromCidr(input);
      setCidr({
        firstIp6: cidrIp6.getFirst().toString(),
        lastIp6: cidrIp6.getLast().toString(),
        firstIp4: '',
        lastIp4: '',
        size: cidrIp6.getSize().toString(),
        nextRange: cidrIp6.nextRange()?.toCidrString() ?? 'No next range',
        previousRange:
          cidrIp6.previousRange()?.toCidrString() ?? 'No previous range',
      });
    }
  }, [input]);

  const OutputField = (props: {
    label: string;
    value?: string | number | null;
  }) => {
    const { label, value } = props;
    return (
      <>
        <TextField
          label={label}
          className={styles.fullWidth}
          disabled
          value={value ?? ''}
        />
        <CopyToClipboardButton output={value ?? ''} />
      </>
    );
  };

  return (
    <DefaultEditor
      input={input}
      setInput={setInput}
      sample={sample}
      leftContent={
        <TextField
          label="IPv4/v6 CIDR"
          // eslint-disable-next-line
          autoFocus
          id="input"
          className={styles.fullWidth}
          value={input}
          onChange={e => setInput(e.target.value)}
          variant="outlined"
        />
      }
      rightContent={
        error ? (
          <Alert severity="error">
            <AlertTitle>Error!</AlertTitle>
            <div dangerouslySetInnerHTML={{ __html: error }} />
          </Alert>
        ) : (
          <>
            <OutputField label="First IPv4" value={cidr.firstIp4} />
            <OutputField label="Last IPv4" value={cidr.lastIp4} />
            <OutputField label="First IPv6" value={cidr.firstIp6} />
            <OutputField label="Last IPv6" value={cidr.lastIp6} />
            <OutputField label="Number of addresses" value={cidr.size} />
            <OutputField label="Next range" value={cidr.nextRange} />
            <OutputField label="Previous range" value={cidr.previousRange} />
          </>
        )
      }
    />
  );
};

export default CidrCalculator;
*/
