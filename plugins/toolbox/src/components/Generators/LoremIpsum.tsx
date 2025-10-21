import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { lowerCase, upperFirst } from 'lodash';
import { ClearValueButton, CopyToClipboardButton } from '../Buttons';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
} from '@material-ui/core';
import { DefaultSelect } from '../Selects';
import { useToolboxTranslation } from '../../hooks';

const useStyles = makeStyles<Theme>(theme => ({
  formControl: {
    width: '100%',
  },
  gridContainer: {
    marginBottom: theme.spacing(0.625), // 5px
  },
  multiplierBox: {
    marginLeft: theme.spacing(2), // 16px
  },
  buttonGroup: {
    marginLeft: theme.spacing(2), // 16px
    marginBottom: theme.spacing(2), // 16px
  },
  outputGrid: {
    width: '100%',
  },
  textField: {
    width: '100%',
  },
  generateButton: {
    paddingLeft: theme.spacing(2), // 16px
    paddingRight: theme.spacing(2), // 16px
    borderColor: '#E0E0E0',
    borderRadius: theme.spacing(0.5), // 4px
  },
}));

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min;
};

export const LoremIpsum = () => {
  const classes = useStyles();
  const [output, setOutput] = useState('');
  const [multiplier, setMultiplier] = useState(1);

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
    const { t } = useToolboxTranslation();
    const title = props.title ? props.title : upperFirst(lowerCase(props.type));
    const translatedTitle = t(
      `tool.lorem-ipsum-generate.button.${props.type.toLowerCase()}`,
      { defaultValue: title },
    );
    return (
      <Button
        size="small"
        variant="outlined"
        onClick={() => generate(props.type)}
        color="inherit"
        className={classes.generateButton}
      >
        {translatedTitle}
      </Button>
    );
  };

  return (
    <FormControl className={classes.formControl}>
      <Grid container className={classes.gridContainer}>
        <Grid item>
          <Box className={classes.multiplierBox}>
            <DefaultSelect
              value={multiplier.toString(10)}
              onChange={e =>
                setMultiplier(Number.parseInt(e.target.value as string, 10))
              }
              label="Count"
              variant="standard"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={250}>250</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
            </DefaultSelect>
            <ButtonGroup className={classes.buttonGroup}>
              <ClearValueButton setValue={setOutput} tooltip="Clear output" />
              <CopyToClipboardButton output={output} />
            </ButtonGroup>
          </Box>
          <ButtonGroup className={classes.buttonGroup}>
            <GenerateButton type="line" />
            <GenerateButton type="paragraph" />
            <GenerateButton type="slug" />
            <GenerateButton type="word" />
            <GenerateButton type="hack" />
          </ButtonGroup>
          <ButtonGroup className={classes.buttonGroup}>
            <GenerateButton type="hex" />
            <GenerateButton type="datetime" />
            <GenerateButton type="number" />
            <GenerateButton type="string" />
            <GenerateButton type="uuid" />
          </ButtonGroup>
          <ButtonGroup className={classes.buttonGroup}>
            <GenerateButton type="ipv4" title="IPv4" />
            <GenerateButton type="ipv6" title="IPv6" />
            <GenerateButton type="mac" title="MAC" />
            <GenerateButton type="imei" />
            <GenerateButton type="cron" />
          </ButtonGroup>
          <ButtonGroup className={classes.buttonGroup}>
            <GenerateButton type="domain" />
            <GenerateButton type="password" />
            <GenerateButton type="url" title="URL" />
            <GenerateButton type="user-agent" title="User agent" />
            <GenerateButton type="emoji" />
          </ButtonGroup>
          <ButtonGroup className={classes.buttonGroup}>
            <GenerateButton type="address" />
            <GenerateButton type="name" title="Name" />
            <GenerateButton type="job-title" title="Job title" />
          </ButtonGroup>
          <ButtonGroup className={classes.buttonGroup}>
            <GenerateButton type="product-name" title="Product name" />
            <GenerateButton
              type="product-description"
              title="Product description"
            />
            <GenerateButton type="catch-phrase" title="Catch phrase" />
            <GenerateButton type="song" title="Song name" />
          </ButtonGroup>
          <ButtonGroup className={classes.buttonGroup}>
            <GenerateButton type="bic" title="BIC" />
            <GenerateButton type="credit-card" title="Credit card" />
            <GenerateButton type="iban" title="IBAN" />
          </ButtonGroup>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <TextField
            id="output"
            label="Output"
            value={output || ''}
            style={{ width: '100%' }}
            multiline
            minRows={20}
            maxRows={50}
            variant="outlined"
            autoComplete="off"
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default LoremIpsum;
