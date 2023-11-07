import React, { useEffect } from 'react';
import { DefaultEditor } from '../DefaultEditor/DefaultEditor';
import { TextField } from '@material-ui/core';
import { useStyles } from '../../utils/hooks';
import { faker } from '@faker-js/faker';
import { CopyToClipboardButton } from '../Buttons/CopyToClipboardButton';
import { sha1, sha256, sha384, sha512 } from 'crypto-hash';
import { Md5 } from 'ts-md5';
// @ts-ignore
import md2 from 'js-md2';
// @ts-ignore
import md4 from 'js-md4';

export const Hash = () => {
  const styles = useStyles();
  const [input, setInput] = React.useState('');
  const [hash, setHash] = React.useState({
    md2: '',
    md4: '',
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  });
  const sample = faker.lorem.paragraph();

  useEffect(() => {
    Promise.all([
      md2(input),
      md4(input),
      Md5.hashStr(input),
      sha1(input),
      sha256(input),
      sha384(input),
      sha512(input),
    ]).then(results => {
      setHash({
        md2: results[0],
        md4: results[1],
        md5: results[2],
        sha1: results[3],
        sha256: results[4],
        sha384: results[5],
        sha512: results[6],
      });
    });
  }, [input]);

  const OutputField = (props: { label: string; value?: string | null }) => {
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
      allowFileUpload
      rightContent={
        <>
          <OutputField label="MD2" value={hash.md2} />
          <OutputField label="MD4" value={hash.md4} />
          <OutputField label="MD5" value={hash.md5} />
          <OutputField label="SHA1" value={hash.sha1} />
          <OutputField label="SHA256" value={hash.sha256} />
          <OutputField label="SHA384" value={hash.sha384} />
          <OutputField label="SHA512" value={hash.sha512} />
        </>
      }
    />
  );
};

export default Hash;
