import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { lowerCase, upperFirst } from 'lodash';
import { ClearValueButton, CopyToClipboardButton } from '../Buttons';
import { Button, Flex, Select, Text } from '@backstage/ui';
import { useToolboxTranslation } from '../../hooks';
import styles from '../DefaultEditor/DefaultEditor.module.css';

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min;
};

export const LoremIpsum = () => {
  const [output, setOutput] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const { t } = useToolboxTranslation();

  const generate = (type: string) => {
    let outputs = [];
    switch (type) {
      default:
      case 'line':
        outputs = faker.lorem.lines(multiplier).split('\n');
        break;
      case 'paragraph':
        outputs = faker.lorem.paragraphs(multiplier, '\n').split('\n');
        break;
      case 'slug':
        outputs = faker.lorem.slug(multiplier).split('\n');
        break;
      case 'word':
        outputs = faker.lorem.words(multiplier).split('\n');
        break;
      case 'hack':
        outputs = [...Array(multiplier)].map(faker.hacker.phrase);
        break;
      case 'hex':
        outputs = [...Array(multiplier)].map(() =>
          faker.string.hexadecimal({
            length: randomInt(1, 50),
            casing: 'lower',
          }),
        );
        break;
      case 'datetime':
        outputs = [...Array(multiplier)].map(faker.date.anytime);
        break;
      case 'number':
        outputs = [...Array(multiplier)].map(() =>
          faker.number.int({ min: 1, max: 100000000000000000 }),
        );
        break;
      case 'string':
        outputs = [...Array(multiplier)].map(() =>
          faker.string.sample(randomInt(10, 100)),
        );
        break;
      case 'uuid':
        outputs = [...Array(multiplier)].map(faker.string.uuid);
        break;
      case 'ipv4':
        outputs = [...Array(multiplier)].map(faker.internet.ipv4);
        break;
      case 'ipv6':
        outputs = [...Array(multiplier)].map(faker.internet.ipv6);
        break;
      case 'mac':
        outputs = [...Array(multiplier)].map(faker.internet.mac);
        break;
      case 'domain':
        outputs = [...Array(multiplier)].map(faker.internet.domainName);
        break;
      case 'password':
        outputs = [...Array(multiplier)].map(() =>
          faker.internet.password({
            length: randomInt(10, 100),
            memorable: false,
          }),
        );
        break;
      case 'url':
        outputs = [...Array(multiplier)].map(faker.internet.url);
        break;
      case 'user-agent':
        outputs = [...Array(multiplier)].map(faker.internet.userAgent);
        break;
      case 'imei':
        outputs = [...Array(multiplier)].map(faker.phone.imei);
        break;
      case 'cron':
        outputs = [...Array(multiplier)].map(faker.system.cron);
        break;
      case 'emoji':
        outputs = [...Array(multiplier)].map(faker.internet.emoji);
        break;
      case 'address':
        outputs = [...Array(multiplier)].map(
          () =>
            `${faker.location.streetAddress(
              true,
            )}, ${faker.location.zipCode()} ${faker.location.city()}, ${faker.location.country()}`,
        );
        break;
      case 'product-name':
        outputs = [...Array(multiplier)].map(faker.commerce.productName);
        break;
      case 'product-description':
        outputs = [...Array(multiplier)].map(faker.commerce.productDescription);
        break;
      case 'catch-phrase':
        outputs = [...Array(multiplier)].map(faker.company.catchPhrase);
        break;
      case 'bic':
        outputs = [...Array(multiplier)].map(faker.finance.bic);
        break;
      case 'credit-card':
        outputs = [...Array(multiplier)].map(faker.finance.creditCardNumber);
        break;
      case 'iban':
        outputs = [...Array(multiplier)].map(() =>
          faker.finance.iban({ formatted: true }),
        );
        break;
      case 'song':
        outputs = [...Array(multiplier)].map(faker.music.songName);
        break;
      case 'name':
        outputs = [...Array(multiplier)].map(faker.person.fullName);
        break;
      case 'job-title':
        outputs = [...Array(multiplier)].map(faker.person.jobTitle);
        break;
    }
    setOutput(outputs.join('\n'));
  };

  const GenerateButton = (props: { type: string; title?: string }) => {
    const title = props.title ? props.title : upperFirst(lowerCase(props.type));
    const translatedTitle = t(
      `tool.lorem-ipsum-generate.button.${props.type.toLowerCase()}`,
      { defaultValue: title },
    );
    return (
      <Button variant="secondary" onClick={() => generate(props.type)}>
        {translatedTitle}
      </Button>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Flex
        gap="2"
        align="center"
        style={{ marginBottom: 'var(--bui-space-2)' }}
      >
        <Select
          label="Count"
          selectedKey={String(multiplier)}
          onSelectionChange={key =>
            setMultiplier(Number.parseInt(key as string, 10))
          }
          options={[1, 5, 10, 25, 50, 100, 250, 500, 1000].map(n => ({
            value: String(n),
            label: String(n),
          }))}
        />
        <ClearValueButton setValue={setOutput} tooltip="Clear output" />
        <CopyToClipboardButton output={output} />
      </Flex>
      <div style={{ marginBottom: 'var(--bui-space-4)' }}>
        <Text
          variant="body-small"
          style={{
            color: 'var(--bui-fg-secondary)',
            display: 'block',
            marginBottom: 'var(--bui-space-1)',
          }}
        >
          Text
        </Text>
        <Flex gap="2" style={{ flexWrap: 'wrap' }}>
          <GenerateButton type="line" />
          <GenerateButton type="paragraph" />
          <GenerateButton type="slug" />
          <GenerateButton type="word" />
          <GenerateButton type="hack" />
        </Flex>
      </div>
      <div style={{ marginBottom: 'var(--bui-space-4)' }}>
        <Text
          variant="body-small"
          style={{
            color: 'var(--bui-fg-secondary)',
            display: 'block',
            marginBottom: 'var(--bui-space-1)',
          }}
        >
          Identifiers
        </Text>
        <Flex gap="2" style={{ flexWrap: 'wrap' }}>
          <GenerateButton type="hex" />
          <GenerateButton type="datetime" />
          <GenerateButton type="number" />
          <GenerateButton type="string" />
          <GenerateButton type="uuid" />
        </Flex>
      </div>
      <div style={{ marginBottom: 'var(--bui-space-4)' }}>
        <Text
          variant="body-small"
          style={{
            color: 'var(--bui-fg-secondary)',
            display: 'block',
            marginBottom: 'var(--bui-space-1)',
          }}
        >
          Network
        </Text>
        <Flex gap="2" style={{ flexWrap: 'wrap' }}>
          <GenerateButton type="ipv4" title="IPv4" />
          <GenerateButton type="ipv6" title="IPv6" />
          <GenerateButton type="mac" title="MAC" />
          <GenerateButton type="imei" />
          <GenerateButton type="cron" />
          <GenerateButton type="domain" />
          <GenerateButton type="password" />
          <GenerateButton type="url" title="URL" />
          <GenerateButton type="user-agent" title="User agent" />
          <GenerateButton type="emoji" />
        </Flex>
      </div>
      <div style={{ marginBottom: 'var(--bui-space-4)' }}>
        <Text
          variant="body-small"
          style={{
            color: 'var(--bui-fg-secondary)',
            display: 'block',
            marginBottom: 'var(--bui-space-1)',
          }}
        >
          Personal &amp; Business
        </Text>
        <Flex gap="2" style={{ flexWrap: 'wrap' }}>
          <GenerateButton type="address" />
          <GenerateButton type="product-name" />
          <GenerateButton type="product-description" />
          <GenerateButton type="catch-phrase" />
          <GenerateButton type="bic" title="BIC" />
          <GenerateButton type="credit-card" />
          <GenerateButton type="iban" title="IBAN" />
          <GenerateButton type="song" />
          <GenerateButton type="name" />
          <GenerateButton type="job-title" />
        </Flex>
      </div>
      <div>
        <label htmlFor="lorem-output" className={styles.fieldLabel}>
          Output
        </label>
        <textarea
          id="lorem-output"
          className={styles.textarea}
          value={output || ''}
          readOnly
          rows={20}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default LoremIpsum;
