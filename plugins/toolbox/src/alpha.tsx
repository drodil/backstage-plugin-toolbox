import {
  ApiBlueprint,
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
  createFrontendPlugin,
  NavItemBlueprint,
  OverridableFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { compatWrapper } from '@backstage/core-compat-api';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { toolboxApiRef, ToolboxClient } from './api';
import { rootRouteRef } from './routes.ts';
import CardTravel from '@material-ui/icons/CardTravel';
import {
  ToolboxToolBlueprint,
  toolDataRef,
} from '@drodil/backstage-plugin-toolbox-react/alpha';

// TODO: Add homepage content blueprint

export {
  /**
   * @deprecated Use `@drodil/backstage-plugin-toolbox-react/alpha` instead
   */
  toolDataRef,
  /**
   * @deprecated Use `@drodil/backstage-plugin-toolbox-react/alpha` instead
   */
  ToolboxToolBlueprint,
} from '@drodil/backstage-plugin-toolbox-react/alpha';

const toolboxApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: toolboxApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory({ discoveryApi, fetchApi }) {
        return new ToolboxClient({ discoveryApi, fetchApi });
      },
    }),
});

export const ToolboxWelcomePageBlueprint = createExtensionBlueprint({
  kind: 'welcome-page',
  attachTo: { id: 'page:toolbox', input: 'welcomePage' },
  output: [coreExtensionData.reactElement],
  factory(params: { element: JSX.Element }) {
    return [coreExtensionData.reactElement(params.element)];
  },
});

const toolboxPage = PageBlueprint.makeWithOverrides({
  inputs: {
    tools: createExtensionInput([toolDataRef], {
      singleton: false,
      optional: false,
    }),
    welcomePage: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
      optional: true,
    }),
  },
  factory: (originalFactory, { config, inputs }) => {
    const tools = inputs.tools.map(t =>
      t.get(ToolboxToolBlueprint.dataRefs.tool),
    );
    const welcomePage = inputs.welcomePage?.get(coreExtensionData.reactElement);
    return originalFactory({
      path: config.path ?? '/toolbox',
      routeRef: rootRouteRef,
      loader: () =>
        import('./components/Root').then(m =>
          compatWrapper(<m.Root tools={tools} welcomePage={welcomePage} />),
        ),
    });
  },
});

/** Tools */
const base64EncodeTool = ToolboxToolBlueprint.make({
  name: 'base64-encode',
  params: {
    id: 'base64-encode',
    displayName: 'Base64',
    description: 'Encode and decode base64 strings',
    category: 'Encode/Decode',
    async loader() {
      const m = await import('./components/Encoders/Base64Encode');
      return compatWrapper(<m.default />);
    },
  },
});

const urlEncodeTool = ToolboxToolBlueprint.make({
  name: 'url-encode',
  params: {
    id: 'url-encode',
    displayName: 'URL',
    description: 'Encode and decode URLs',
    category: 'Encode/Decode',
    async loader() {
      const m = await import('./components/Encoders/UrlEncode');
      return compatWrapper(<m.default />);
    },
  },
});

const htmlEntitiesEncodeTool = ToolboxToolBlueprint.make({
  name: 'html-entity-encode',
  params: {
    id: 'html-entity-encode',
    displayName: 'HTML entities',
    description: 'Encode and decode HTML entity characters',
    category: 'Encode/Decode',
    async loader() {
      const m = await import('./components/Encoders/HtmlEntities');
      return compatWrapper(<m.default />);
    },
  },
});

const backslashEncodeTool = ToolboxToolBlueprint.make({
  name: 'backslash-encode',
  params: {
    id: 'backslash-encode',
    displayName: 'Backslash escape',
    description: 'Encode and decode backslash escape characters',
    category: 'Encode/Decode',
    async loader() {
      const m = await import('./components/Encoders/Backslash');
      return compatWrapper(<m.default />);
    },
  },
});

const jwtDecoderTool = ToolboxToolBlueprint.make({
  name: 'jwt-decoder-encode',
  params: {
    id: 'jwt-decoder-encode',
    displayName: 'JSON Web Token',
    description: 'Encode and decode JSON Web Tokens',
    category: 'Encode/Decode',
    aliases: ['jwt'],
    async loader() {
      const m = await import('./components/Encoders/JwtDecoder');
      return compatWrapper(<m.default />);
    },
  },
});

const markdownPreviewTool = ToolboxToolBlueprint.make({
  name: 'markdown-preview',
  params: {
    id: 'markdown-preview',
    displayName: 'Markdown preview',
    description: 'Render markdown as HTML',
    aliases: ['md'],
    async loader() {
      const m = await import('./components/Converters/MarkdownPreview');
      return compatWrapper(<m.default />);
    },
  },
});

const csvToJsonTool = ToolboxToolBlueprint.make({
  name: 'csv-to-json-convert',
  params: {
    id: 'csv-to-json-convert',
    displayName: 'CSV to JSON',
    description: 'Convert CSV text to JSON',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/CsvToJson');
      return compatWrapper(<m.default />);
    },
  },
});

const jsonConverterTool = ToolboxToolBlueprint.make({
  name: 'json-converter',
  params: {
    id: 'json-converter',
    displayName: 'JSON',
    description: 'Convert JSON to CSV, String or YAML ',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/JsonConverter');
      return compatWrapper(<m.default />);
    },
  },
});

const xmlToJsonTool = ToolboxToolBlueprint.make({
  name: 'xml-to-json-convert',
  params: {
    id: 'xml-to-json-convert',
    displayName: 'XML to JSON',
    description: 'Convert to XML text to JSON',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/XmlToJson');
      return compatWrapper(<m.default />);
    },
  },
});

const yamlToJsonTool = ToolboxToolBlueprint.make({
  name: 'yaml-to-json-convert',
  params: {
    id: 'yaml-to-json-convert',
    displayName: 'YAML to JSON',
    description: 'Convert to YAML text to JSON',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/YamlToJson');
      return compatWrapper(<m.default />);
    },
  },
});

const richTextToMarkdownTool = ToolboxToolBlueprint.make({
  name: 'rich-text-to-markdown-convert',
  params: {
    id: 'rich-text-to-markdown-convert',
    displayName: 'HTML to Markdown',
    description: 'Convert rich text to markdown',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/RichTextToMarkdown');
      return compatWrapper(<m.default />);
    },
  },
});

const numberBaseTool = ToolboxToolBlueprint.make({
  name: 'number-base-convert',
  params: {
    id: 'number-base-convert',
    displayName: 'Number base',
    description: 'Convert numbers between different bases',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/NumberBase');
      return compatWrapper(<m.default />);
    },
  },
});

const stringUtilitiesTool = ToolboxToolBlueprint.make({
  name: 'string-utilities-convert',
  params: {
    id: 'string-utilities-convert',
    displayName: 'String utilities',
    description: 'Convert string to different case or string',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/StringUtilities');
      return compatWrapper(<m.default />);
    },
  },
});

const stringAnalyzerTool = ToolboxToolBlueprint.make({
  name: 'string-analyzer',
  params: {
    id: 'string-analyzer',
    displayName: 'String analyzer',
    description: 'Analyze string and get statistics',
    category: 'Miscellaneous',
    async loader() {
      const m = await import('./components/Misc/StringAnalyzer');
      return compatWrapper(<m.default />);
    },
  },
});

const timeConverterTool = ToolboxToolBlueprint.make({
  name: 'time-convert',
  params: {
    id: 'time-convert',
    displayName: 'Time format',
    description: 'Convert to time to different presentations',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/TimeConverter');
      return compatWrapper(<m.default />);
    },
  },
});

const colorConverterTool = ToolboxToolBlueprint.make({
  name: 'color-convert',
  params: {
    id: 'color-convert',
    displayName: 'Color format',
    description: 'Convert colors between different formats',
    category: 'Convert',
    async loader() {
      const m = await import('./components/Converters/ColorConverter');
      return compatWrapper(<m.default />);
    },
  },
});

const slaCalculatorTool = ToolboxToolBlueprint.make({
  name: 'sla-calculator',
  params: {
    id: 'sla-calculator',
    displayName: 'Service level agreement',
    description: 'Calculate service level agreement percentage in time',
    category: 'Calculate',
    async loader() {
      const m = await import('./components/Converters/SLACalculator');
      return compatWrapper(<m.default />);
    },
  },
});

const entityValidatorTool = ToolboxToolBlueprint.make({
  name: 'entity-validator',
  params: {
    id: 'entity-validator',
    displayName: 'Entity validator',
    description: 'Validate catalog entity YAML',
    category: 'Backstage',
    async loader() {
      const m = await import('./components/Validators/EntityValidator');
      return compatWrapper(<m.default />);
    },
  },
});

const entityDescriberTool = ToolboxToolBlueprint.make({
  name: 'entity-describer',
  params: {
    id: 'entity-describer',
    displayName: 'Entity describer',
    description: 'Describes existing catalog entity in YAML',
    category: 'Backstage',
    async loader() {
      const m = await import('./components/Misc/EntityDescriber');
      return compatWrapper(<m.default />);
    },
  },
});

const csrTool = ToolboxToolBlueprint.make({
  name: 'csr-generate',
  params: {
    id: 'csr-generate',
    displayName: 'CSR',
    description: 'Generate CSR',
    category: 'Generate',
    async loader() {
      const m = await import('./components/Generators/CSR');
      return compatWrapper(<m.default />);
    },
  },
});

const qrCodeTool = ToolboxToolBlueprint.make({
  name: 'qr-code-generate',
  params: {
    id: 'qr-code-generate',
    displayName: 'QR Code',
    description: 'Generate QR code from text',
    category: 'Generate',
    async loader() {
      const m = await import('./components/Generators/QRCode');
      return compatWrapper(<m.default />);
    },
  },
});

const barCodeTool = ToolboxToolBlueprint.make({
  name: 'bar-code-generate',
  params: {
    id: 'bar-code-generate',
    displayName: 'Barcode',
    description: 'Generate Barcode from text',
    category: 'Generate',
    async loader() {
      const m = await import('./components/Generators/BarCode');
      return compatWrapper(<m.default />);
    },
  },
});

const loremIpsumTool = ToolboxToolBlueprint.make({
  name: 'lorem-ipsum-generate',
  params: {
    id: 'lorem-ipsum-generate',
    displayName: 'Lorem Ipsum',
    description: 'Generate random text for placeholders',
    category: 'Generate',
    async loader() {
      const m = await import('./components/Generators/LoremIpsum');
      return compatWrapper(<m.default />);
    },
  },
});

const hashTool = ToolboxToolBlueprint.make({
  name: 'hash-generate',
  params: {
    id: 'hash-generate',
    displayName: 'Hash',
    description: 'Calculate hash from given text',
    category: 'Calculate',
    aliases: ['md2', 'md5', 'sha1', 'sha256', 'sha512'],
    async loader() {
      const m = await import('./components/Generators/Hash');
      return compatWrapper(<m.default />);
    },
  },
});

const interfaceTool = ToolboxToolBlueprint.make({
  name: 'interface-generate',
  params: {
    id: 'interface-generate',
    displayName: 'JSON to Interface',
    description:
      'Generate interfaces for different programming languages from JSON',
    category: 'Generate',
    async loader() {
      const m = await import('./components/Generators/Interface');
      return compatWrapper(<m.default />);
    },
  },
});

const jsBeautifyTool = ToolboxToolBlueprint.make({
  name: 'format-js',
  params: {
    id: 'format-js',
    displayName: 'Javascript / JSON',
    description: 'Reformat Javascript / JSON code with Beautify',
    category: 'Format',
    aliases: ['js-beautify', 'js'],
    async loader() {
      const m = await import('./components/Formatters/JSBeautify');
      return compatWrapper(<m.default />);
    },
  },
});

const htmlBeautifyTool = ToolboxToolBlueprint.make({
  name: 'format-html',
  params: {
    id: 'format-html',
    displayName: 'HTML',
    description: 'Reformat HTML code with Beautify',
    category: 'Format',
    async loader() {
      const m = await import('./components/Formatters/HTMLBeautify');
      return compatWrapper(<m.default />);
    },
  },
});

const cssBeautifyTool = ToolboxToolBlueprint.make({
  name: 'format-css',
  params: {
    id: 'format-css',
    displayName: 'CSS',
    description: 'Reformat CSS code with Beautify',
    category: 'Format',
    async loader() {
      const m = await import('./components/Formatters/CSSBeautify');
      return compatWrapper(<m.default />);
    },
  },
});

const sqlBeautifyTool = ToolboxToolBlueprint.make({
  name: 'format-sql',
  params: {
    id: 'format-sql',
    displayName: 'SQL',
    description: 'Reformat SQL code with Beautify',
    category: 'Format',
    async loader() {
      const m = await import('./components/Formatters/SQLBeautify');
      return compatWrapper(<m.default />);
    },
  },
});

const countdownTool = ToolboxToolBlueprint.make({
  name: 'countdown',
  params: {
    id: 'countdown',
    displayName: 'Countdown timer',
    description: 'Timer that counts down and notifies when time runs out',
    category: 'Miscellaneous',
    async loader() {
      const m = await import('./components/Misc/Countdown');
      return compatWrapper(<m.default />);
    },
  },
});

const stopwatchTool = ToolboxToolBlueprint.make({
  name: 'stopwatch',
  params: {
    id: 'stopwatch',
    displayName: 'Stopwatch timer',
    description: 'Timer that counts up until stopped',
    category: 'Miscellaneous',
    async loader() {
      const m = await import('./components/Misc/Timer');
      return compatWrapper(<m.default />);
    },
  },
});

const diffTool = ToolboxToolBlueprint.make({
  name: 'diff',
  params: {
    id: 'diff',
    displayName: 'Text diff',
    description: 'Shows differences between two texts',
    category: 'Miscellaneous',
    async loader() {
      const m = await import('./components/Misc/Diff');
      return compatWrapper(<m.default />);
    },
  },
});

const ibanValidatorTool = ToolboxToolBlueprint.make({
  name: 'iban',
  params: {
    id: 'iban',
    displayName: 'IBAN validator',
    description: 'Validates IBAN based on ISO 13616',
    category: 'Validate',
    async loader() {
      const m = await import('./components/Validators/IbanValidator');
      return compatWrapper(<m.default />);
    },
  },
});

const regexValidatorTool = ToolboxToolBlueprint.make({
  name: 'regex',
  params: {
    id: 'regex',
    displayName: 'Regex validator',
    description: 'Validates input data against regex expression',
    category: 'Validate',
    async loader() {
      const m = await import('./components/Validators/RegexValidator');
      return compatWrapper(<m.default />);
    },
  },
});

const urlExploderTool = ToolboxToolBlueprint.make({
  name: 'url-exploder',
  params: {
    id: 'url-exploder',
    displayName: 'URL exploder',
    description: 'Explode and modify parts of URL easily',
    category: 'Miscellaneous',
    async loader() {
      const m = await import('./components/Misc/UrlExploder');
      return compatWrapper(<m.default />);
    },
  },
});

const whoisTool = ToolboxToolBlueprint.make({
  name: 'whois',
  params: {
    id: 'whois',
    displayName: 'Whois lookup',
    description: 'Lookup domain WHOIS information',
    category: 'Networking',
    requiresBackend: true,
    async loader() {
      const m = await import('./components/Networking/Whois');
      return compatWrapper(<m.default />);
    },
  },
});

/** @alpha */
export const toolboxNavItem = NavItemBlueprint.make({
  params: {
    title: 'Toolbox',
    routeRef: rootRouteRef,
    icon: CardTravel,
  },
});

/**
 * Backstage frontend plugin.
 *
 * @alpha
 */
const toolboxPlugin: OverridableFrontendPlugin = createFrontendPlugin({
  pluginId: 'toolbox',
  info: { packageJson: () => import('../package.json') },
  routes: {
    root: rootRouteRef,
  },
  extensions: [
    toolboxApi,
    toolboxPage,
    toolboxNavItem,
    // Tools
    base64EncodeTool,
    urlEncodeTool,
    htmlEntitiesEncodeTool,
    backslashEncodeTool,
    jwtDecoderTool,
    markdownPreviewTool,
    csvToJsonTool,
    jsonConverterTool,
    xmlToJsonTool,
    yamlToJsonTool,
    richTextToMarkdownTool,
    numberBaseTool,
    stringUtilitiesTool,
    timeConverterTool,
    colorConverterTool,
    slaCalculatorTool,
    hashTool,
    entityValidatorTool,
    entityDescriberTool,
    csrTool,
    qrCodeTool,
    barCodeTool,
    loremIpsumTool,
    interfaceTool,
    jsBeautifyTool,
    htmlBeautifyTool,
    cssBeautifyTool,
    sqlBeautifyTool,
    stringAnalyzerTool,
    countdownTool,
    stopwatchTool,
    diffTool,
    urlExploderTool,
    ibanValidatorTool,
    regexValidatorTool,
    whoisTool,
  ],
});

export default toolboxPlugin;
