import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
// Converter actions
import { createCsvToJsonAction } from './csvToJson.ts';
import { createJsonToCsvAction } from './jsonToCsv.ts';
import { createJsonToYamlAction } from './jsonToYaml.ts';
import { createYamlToJsonAction } from './yamlToJson.ts';
import { createXmlToJsonAction } from './xmlToJson.ts';
import { createNumberBaseConverterAction } from './numberBaseConverter.ts';
// Encoder actions
import { createBase64EncoderAction } from './base64Encoder.ts';
import { createUrlEncoderAction } from './urlEncoder.ts';
import { createHtmlEntitiesEncoderAction } from './htmlEntitiesEncoder.ts';
import { createBackslashEncoderAction } from './backslashEncoder.ts';
import { createJwtDecoderAction } from './jwtDecoder.ts';
// Generator actions
import { createHashGeneratorAction } from './hashGenerator.ts';
import { createLoremIpsumGeneratorAction } from './loremIpsumGenerator.ts';
import { createUuidGeneratorAction } from './uuidGenerator.ts';
import { createPasswordGeneratorAction } from './passwordGenerator.ts';
// Misc actions
import { createStringAnalyzerAction } from './stringAnalyzer.ts';
import { createUrlExploderAction } from './urlExploder.ts';
import { createTextDiffAction } from './textDiff.ts';
import { createBackstageIconsAction } from './backstageIconsBrowser.ts';

// Networking actions
import { createCidrCalculatorAction } from './cidrCalculator.ts';
import { createWhoisLookupAction } from './whoisLookup.ts';
// Validator actions
import { createIbanValidatorAction } from './ibanValidator.ts';
import { createRegexValidatorAction } from './regexValidator.ts';
import { createEntityValidatorAction } from './entityValidator.ts';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { Config } from '@backstage/config';

export const registerActions = (options: {
  actionsRegistry: ActionsRegistryService;
  catalog: CatalogService;
  config: Config;
}) => {
  const isActionEnabled = (actionId: string): boolean => {
    const enabled = options.config.getOptionalStringArray(
      'toolbox.enabledActions',
    );
    if (!enabled) return true;
    return enabled.includes(actionId);
  };

  // Converter actions
  if (isActionEnabled('convert-csv-to-json')) {
    createCsvToJsonAction(options);
  }
  if (isActionEnabled('convert-json-to-csv')) {
    createJsonToCsvAction(options);
  }
  if (isActionEnabled('convert-json-to-yaml')) {
    createJsonToYamlAction(options);
  }
  if (isActionEnabled('convert-yaml-to-json')) {
    createYamlToJsonAction(options);
  }
  if (isActionEnabled('convert-xml-to-json')) {
    createXmlToJsonAction(options);
  }
  if (isActionEnabled('convert-number-base')) {
    createNumberBaseConverterAction(options);
  }

  // Encoder actions
  if (isActionEnabled('encode-decode-base64')) {
    createBase64EncoderAction(options);
  }
  if (isActionEnabled('encode-url')) {
    createUrlEncoderAction(options);
  }
  if (isActionEnabled('encode-decode-html-entities')) {
    createHtmlEntitiesEncoderAction(options);
  }
  if (isActionEnabled('escape-unescape-backslash')) {
    createBackslashEncoderAction(options);
  }
  if (isActionEnabled('encode-decode-jwt')) {
    createJwtDecoderAction(options);
  }

  // Generator actions
  if (isActionEnabled('generate-hash')) {
    createHashGeneratorAction(options);
  }
  if (isActionEnabled('generate-lorem-ipsum')) {
    createLoremIpsumGeneratorAction(options);
  }
  if (isActionEnabled('generate-uuid')) {
    createUuidGeneratorAction(options);
  }
  if (isActionEnabled('generate-password')) {
    createPasswordGeneratorAction(options);
  }

  // Misc actions
  if (isActionEnabled('analyze-string')) {
    createStringAnalyzerAction(options);
  }
  if (isActionEnabled('explode-url')) {
    createUrlExploderAction(options);
  }
  if (isActionEnabled('diff-text')) {
    createTextDiffAction(options);
  }
  if (isActionEnabled('icons-list')) {
    createBackstageIconsAction(options);
    // console.log('Finished createBackstageIconsAction.');
  }

  // Networking actions
  if (isActionEnabled('calculate-cidr')) {
    createCidrCalculatorAction(options);
  }
  if (isActionEnabled('whois-lookup')) {
    createWhoisLookupAction(options);
  }

  // Validator actions
  if (isActionEnabled('validate-iban')) {
    createIbanValidatorAction(options);
  }
  if (isActionEnabled('validate-regex')) {
    createRegexValidatorAction(options);
  }
  if (isActionEnabled('validate-entity')) {
    createEntityValidatorAction(options);
  }
};
