import React, { lazy } from 'react';
import { Tool } from './ToolsPage';
import { Button } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

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

const JSBeautify = lazy(() => import('../Formatters/JSBeautify'));
const HTMLBeautify = lazy(() => import('../Formatters/HTMLBeautify'));
const CSSBeautify = lazy(() => import('../Formatters/CSSBeautify'));
const SQLBeautify = lazy(() => import('../Formatters/SQLBeautify'));

export const defaultTools: Tool[] = [
  {
    id: 'base64-encode',
    name: 'Base64',
    component: <Base64Encode />,
    category: 'Encode/Decode',
  },
  {
    id: 'url-encode',
    name: 'URL',
    component: <UrlEncode />,
    category: 'Encode/Decode',
  },
  {
    id: 'html-entity-encode',
    name: 'HTML entities',
    component: <HtmlEntities />,
    category: 'Encode/Decode',
  },
  {
    id: 'number-base-convert',
    name: 'Number base',
    component: <NumberBase />,
    category: 'Convert',
  },
  {
    id: 'markdown-preview',
    name: 'Markdown preview',
    component: <MarkdownPreview />,
  },
  {
    id: 'csv-to-json-convert',
    name: 'CSV to JSON',
    component: <CsvToJson />,
    category: 'Convert',
  },
  {
    id: 'json-to-csv-convert',
    name: 'JSON to CSV',
    component: <JsonToCsv />,
    category: 'Convert',
  },
  {
    id: 'xml-to-json-convert',
    name: 'XML to JSON',
    component: <XmlToJson />,
    category: 'Convert',
  },
  {
    id: 'json-to-yaml-convert',
    name: 'JSON to YAML',
    component: <JsonToYaml />,
    category: 'Convert',
  },
  {
    id: 'yaml-to-json-convert',
    name: 'YAML to JSON',
    component: <YamlToJson />,
    category: 'Convert',
  },
  {
    id: 'string-case-convert',
    name: 'String case',
    component: <StringCase />,
    category: 'Convert',
  },
  {
    id: 'time-convert',
    name: 'Time converter',
    component: <TimeConverter />,
    category: 'Convert',
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
  },
  {
    id: 'backslash-encode',
    name: 'Backslash escape',
    component: <Backslash />,
    category: 'Encode/Decode',
  },
  {
    id: 'lorem-ipsum-generate',
    name: 'Lorem Ipsum',
    component: <LoremIpsum />,
    category: 'Generate',
  },
  {
    id: 'hash-generate',
    name: 'Hash',
    component: <Hash />,
    category: 'Generate',
  },
  {
    id: 'format-js',
    name: 'JS Beautify',
    component: <JSBeautify />,
    category: 'Format',
  },
  {
    id: 'format-html',
    name: 'HTML Beautify',
    component: <HTMLBeautify />,
    category: 'Format',
  },
  {
    id: 'format-css',
    name: 'CSS Beautify',
    component: <CSSBeautify />,
    category: 'Format',
  },
  {
    id: 'format-sql',
    name: 'SQL Beautify',
    component: <SQLBeautify />,
    category: 'Format',
  },
];
