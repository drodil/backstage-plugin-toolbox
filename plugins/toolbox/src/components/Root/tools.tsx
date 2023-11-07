import React, { lazy } from 'react';
import { Tool } from './ToolsPage';
import { Button } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

const Base64Encode = lazy(() => import('../Encoders/Base64Encode'));
const UrlEncode = lazy(() => import('../Encoders/UrlEncode'));
const HtmlEntities = lazy(() => import('../Encoders/HtmlEntities'));
const Backslash = lazy(() => import('../Encoders/Backslash'));
const JwtDecoder = lazy(() => import('../Encoders/JwtDecoder'));

const NumberBase = lazy(() => import('../Converters/NumberBase'));
const MarkdownPreview = lazy(() => import('../Converters/MarkdownPreview'));
const CsvToJson = lazy(() => import('../Converters/CsvToJson'));
const JsonToCsv = lazy(() => import('../Converters/JsonToCsv'));
const JsonToYaml = lazy(() => import('../Converters/JsonToYaml'));
const YamlToJson = lazy(() => import('../Converters/YamlToJson'));
const StringCase = lazy(() => import('../Converters/StringCase'));
const TimeConverter = lazy(() => import('../Converters/TimeConverter'));
const XmlToJson = lazy(() => import('../Converters/XmlToJson'));
const SLACalculator = lazy(() => import('../Converters/SLACalculator'));
const ColorConverter = lazy(() => import('../Converters/ColorConverter'));
const RichTextToMarkdown = lazy(
  () => import('../Converters/RichTextToMarkdown'),
);

const EntityValidator = lazy(() => import('../Validators/EntityValidator'));
const EntityDescriber = lazy(() => import('../Misc/EntityDescriber'));
const Countdown = lazy(() => import('../Misc/Countdown'));
const Timer = lazy(() => import('../Misc/Timer'));
const Diff = lazy(() => import('../Misc/Diff'));

const LoremIpsum = lazy(() => import('../Generators/LoremIpsum'));
const Hash = lazy(() => import('../Generators/Hash'));
const QRCode = lazy(() => import('../Generators/QRCode'));

const JSBeautify = lazy(() => import('../Formatters/JSBeautify'));
const HTMLBeautify = lazy(() => import('../Formatters/HTMLBeautify'));
const CSSBeautify = lazy(() => import('../Formatters/CSSBeautify'));
const SQLBeautify = lazy(() => import('../Formatters/SQLBeautify'));

// const CidrCalculator = lazy(() => import('../Networking/CidrCalculator'));

export const defaultTools: Tool[] = [
  {
    id: 'base64-encode',
    name: 'Base64',
    component: <Base64Encode />,
    category: 'Encode/Decode',
    description: 'Encode and decode base64 strings',
  },
  {
    id: 'url-encode',
    name: 'URL',
    component: <UrlEncode />,
    category: 'Encode/Decode',
    description: 'Encode and decode URLs',
  },
  {
    id: 'html-entity-encode',
    name: 'HTML entities',
    component: <HtmlEntities />,
    category: 'Encode/Decode',
    description: 'Encode and decode HTML entity characters',
  },
  {
    id: 'backslash-encode',
    name: 'Backslash escape',
    component: <Backslash />,
    category: 'Encode/Decode',
    description: 'Encode and decode backslash escape characters',
  },
  {
    id: 'jwt-decoder-encode',
    name: 'JSON Web Token',
    component: <JwtDecoder />,
    category: 'Encode/Decode',
    description: 'Decode JSON Web Tokens tokens',
  },

  {
    id: 'markdown-preview',
    name: 'Markdown preview',
    component: <MarkdownPreview />,
    description: 'Render markdown as HTML',
  },
  {
    id: 'csv-to-json-convert',
    name: 'CSV to JSON',
    component: <CsvToJson />,
    category: 'Convert',
    description: 'Convert CSV text to JSON',
  },
  {
    id: 'json-to-csv-convert',
    name: 'JSON to CSV',
    component: <JsonToCsv />,
    category: 'Convert',
    description: 'Convert to JSON text to CSV',
  },
  {
    id: 'xml-to-json-convert',
    name: 'XML to JSON',
    component: <XmlToJson />,
    category: 'Convert',
    description: 'Convert to XML text to JSON',
  },
  {
    id: 'json-to-yaml-convert',
    name: 'JSON to YAML',
    component: <JsonToYaml />,
    category: 'Convert',
    description: 'Convert to JSON text to YAML',
  },
  {
    id: 'yaml-to-json-convert',
    name: 'YAML to JSON',
    component: <YamlToJson />,
    category: 'Convert',
    description: 'Convert to YAML text to JSON',
  },
  {
    id: 'rich-text-to-markdown-convert',
    name: 'HTML to Markdown',
    component: <RichTextToMarkdown />,
    category: 'Convert',
    description: 'Convert rich text to markdown',
  },
  {
    id: 'number-base-convert',
    name: 'Number base',
    component: <NumberBase />,
    category: 'Convert',
    description: 'Convert numbers between different bases',
  },
  {
    id: 'string-case-convert',
    name: 'String case',
    component: <StringCase />,
    category: 'Convert',
    description: 'Convert string to different casing styles',
  },
  {
    id: 'time-convert',
    name: 'Time format',
    component: <TimeConverter />,
    category: 'Convert',
    description: 'Convert to time to different presentations',
  },
  {
    id: 'color-convert',
    name: 'Color format',
    component: <ColorConverter />,
    category: 'Convert',
    description: 'Convert to color between different representation models',
  },

  {
    id: 'sla-calculator',
    name: 'Service level agreement',
    component: <SLACalculator />,
    category: 'Calculate',
    description: 'Calculate service level agreement percentage in time',
  },
  {
    id: 'entity-validator',
    name: 'Entity validator',
    component: <EntityValidator />,
    category: 'Backstage',
    headerButtons: [
      <Button
        variant="contained"
        size="small"
        target="_blank"
        href="https://backstage.io/docs/features/software-catalog/descriptor-format"
        startIcon={<DescriptionIcon />}
      >
        Entity descriptor format
      </Button>,
    ],
    description: 'Validate catalog entity YAML',
  },
  {
    id: 'entity-describer',
    name: 'Entity describer',
    component: <EntityDescriber />,
    category: 'Backstage',
    description: 'Describes existing catalog entity in YAML',
  },
  {
    id: 'qr-code-generate',
    name: 'QR Code',
    component: <QRCode />,
    category: 'Generate',
    description: 'Generate QR code from text',
  },
  {
    id: 'lorem-ipsum-generate',
    name: 'Lorem Ipsum',
    component: <LoremIpsum />,
    category: 'Generate',
    description: 'Generate random text for placeholders',
  },
  {
    id: 'hash-generate',
    name: 'Hash',
    component: <Hash />,
    category: 'Calculate',
    description: 'Calculate hash from given text',
  },
  {
    id: 'format-js',
    name: 'Javascript',
    component: <JSBeautify />,
    category: 'Format',
    description: 'Reformat Javascript code with Beautify',
  },
  {
    id: 'format-html',
    name: 'HTML',
    component: <HTMLBeautify />,
    category: 'Format',
    description: 'Reformat HTML code with Beautify',
  },
  {
    id: 'format-css',
    name: 'CSS',
    component: <CSSBeautify />,
    category: 'Format',
    description: 'Reformat CSS code with Beautify',
  },
  {
    id: 'format-sql',
    name: 'SQL',
    component: <SQLBeautify />,
    category: 'Format',
    description: 'Reformat SQL code with Beautify',
  },
  {
    id: 'countdown',
    name: 'Countdown timer',
    component: <Countdown />,
    category: 'Miscellaneous',
    description: 'Timer that counts down and notifies when time runs out',
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch timer',
    component: <Timer />,
    category: 'Miscellaneous',
    description: 'Timer that counts up until stopped',
  },
  {
    id: 'diff',
    name: 'Text diff',
    component: <Diff />,
    category: 'Miscellaneous',
    description: 'Shows differences between two texts',
  },
  /**
  {
    id: 'cidr-calculator',
    name: 'CIDR calculator',
    component: <CidrCalculator />,
    category: 'Networking',
  },
  */
];
