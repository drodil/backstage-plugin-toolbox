import React, { lazy } from 'react';
import { Tool } from './Root';

const Base64Encode = lazy(() => import('../Encoders/Base64Encode'));
const UrlEncode = lazy(() => import('../Encoders/UrlEncode'));
const HtmlEntities = lazy(() => import('../Encoders/HtmlEntities'));
const Backslash = lazy(() => import('../Encoders/Backslash'));

const NumberBase = lazy(() => import('../Converters/NumberBase'));
const MarkdownPreview = lazy(() => import('../Converters/MarkdownPreview'));
const CsvToJson = lazy(() => import('../Converters/CsvToJson'));
const JsonToCsv = lazy(() => import('../Converters/JsonToCsv'));
const JsonToYaml = lazy(() => import('../Converters/JsonToYaml'));
const YamlToJson = lazy(() => import('../Converters/YamlToJson'));
const StringCase = lazy(() => import('../Converters/StringCase'));
const TimeConverter = lazy(() => import('../Converters/TimeConverter'));
const XmlToJson = lazy(() => import('../Converters/XmlToJson'));

const EntityValidator = lazy(() => import('../Validators/EntityValidator'));

const LoremIpsum = lazy(() => import('../Generators/LoremIpsum'));
const Hash = lazy(() => import('../Generators/Hash'));

export const defaultTools: Tool[] = [
  {
    name: 'Base64',
    component: <Base64Encode />,
    category: 'Encoding/Decoding',
  },
  {
    name: 'URL',
    component: <UrlEncode />,
    category: 'Encoding/Decoding',
  },
  {
    name: 'HTML entities',
    component: <HtmlEntities />,
    category: 'Encoding/Decoding',
  },
  {
    name: 'Number base',
    component: <NumberBase />,
    category: 'Conversion',
  },
  {
    name: 'Markdown preview',
    component: <MarkdownPreview />,
  },
  {
    name: 'CSV to JSON',
    component: <CsvToJson />,
    category: 'Conversion',
  },
  {
    name: 'JSON to CSV',
    component: <JsonToCsv />,
    category: 'Conversion',
  },
  {
    name: 'XML to JSON',
    component: <XmlToJson />,
    category: 'Conversion',
  },
  {
    name: 'JSON to YAML',
    component: <JsonToYaml />,
    category: 'Conversion',
  },
  {
    name: 'YAML to JSON',
    component: <YamlToJson />,
    category: 'Conversion',
  },
  {
    name: 'String case',
    component: <StringCase />,
    category: 'Conversion',
  },
  {
    name: 'Time converter',
    component: <TimeConverter />,
    category: 'Conversion',
  },
  {
    name: 'Entity validator',
    component: <EntityValidator />,
    category: 'Backstage',
  },
  {
    name: 'Backslash escape',
    component: <Backslash />,
    category: 'Encoding/Decoding',
  },
  {
    name: 'Lorem Ipsum',
    component: <LoremIpsum />,
    category: 'Generators',
  },
  {
    name: 'Hash',
    component: <Hash />,
    category: 'Generators',
  },
];
