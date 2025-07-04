import { createTranslationMessages } from '@backstage/core-plugin-api/alpha';
import { toolboxTranslationRef } from '../translation';

const de = createTranslationMessages({
  ref: toolboxTranslationRef,
  full: false,
  messages: {
    // Toolsseite
    'toolsPage.title': 'Toolbox',
    'toolsPage.pageTitle': 'Toolbox',
    'toolsPage.input.search': 'Suche',
    'toolsPage.tabPanel.mainLabel': 'Toolbox',
    'toolsPage.tabPanel.tooltipTitle': 'Öffne Tool in neuem Fenster',
    'toolPage.toolNotAvailable': 'Tool nicht verfügbar',
    // Willkommensseite
    'welcomePage.introText':
      'Die Toolbox enthält Tools für Entwicklung und Design. Alle Tools laufen auf lokalen Rechnern, es werden keine Daten nach außerhalb gegeben. Dies ist eine Art Swiss-Army-Knife für Entwickler gedacht.',
    'welcomePage.secondText':
      'Um Tools auszuwählen klicken Sie auf die Karten unten, bzw. links im Navigationsbaum.',
    // Komponenten
    'components.clearValueButton.tooltipTitle': 'Leere Eingabefeld',
    'components.clearValueButton.buttonText': 'Leeren',
    'components.copyToClipboardButton.tooltipTitle':
      'Kopiere in Zwischenablage',
    'components.copyToClipboardButton.buttonText': 'Kopieren',
    'components.favoriteButton.tooltipTitleFavorite':
      'Füge Tool zu Favoriten hinzu',
    'components.favoriteButton.tooltipTitleNotFavorite':
      'Entferne Tool aus Favoriten',
    'components.fileDownloadButton.tooltipTitle': 'Datei herunterladen',
    'components.fileDownloadButton.buttonText': 'Download',
    'components.fileUploadButton.tooltipTitle': 'Datei hochladen',
    'components.fileUploadButton.buttonText': 'Upload',
    'components.pasteFromClipboardButton.tooltipTitle':
      'Einfügen aus Zwischenablage',
    'components.pasteFromClipboardButton.buttonText': 'Einfügen',
    'components.sampleButton.tooltipTitle': 'Einfügen von Beispieldaten',
    'components.sampleButton.buttonText': 'Sampledaten',
    'components.defaultEditor.inputLabel': 'Eingabe',
    'components.defaultEditor.outputLabel': 'Ausgabe',
    'components.defaultEditor.patternLabel': 'Pattern',
    'components.defaultEditor.mode.encode': 'Encode',
    'components.defaultEditor.mode.decode': 'Decode',
    'components.defaultEditor.mode.replace': 'Ersetzen',
    'components.defaultEditor.mode.camel': 'Camelcase',
    'components.defaultEditor.mode.snake': 'Snakecase',
    'components.defaultEditor.mode.kebab': 'Kebabcase',
    'components.defaultEditor.mode.upper': 'Großbuchstaben',
    'components.defaultEditor.mode.lower': 'Kleinbuchstaben',
    'components.jsonSpaceSelector.space_one': '1 Leerzeichen',
    'components.jsonSpaceSelector.space_two': '2 Leerzeichen',
    'components.jsonSpaceSelector.space_other': '{{count}} Leerzeichen',
    'components.homePageCard.selectToolText':
      'Wählen Sie ein Tool aus den Möglichkeiten',
    // Tools
    'tool.category.favorites': 'Favoriten',
    'tool.category.calculate': 'Rechner',
    'tool.category.convert': 'Konverter',
    'tool.category.encode/decode': 'Encoder/Decoder',
    'tool.category.format': 'Formatter',
    'tool.category.generate': 'Generatoren',
    'tool.category.miscellaneous': 'Diverses',
    // einzelne Tools
    'tool.base64-encode.description': 'Encodiere/Decodiere base64 Strings',
    'tool.url-encode.description': 'Encodiere/Decodiere URLs',
    'tool.html-entity-encode.name': 'HTML-Entity',
    'tool.html-entity-encode.description': 'Encodiere/Decodiere HTML-Entities',
    'tool.backslash-encode.name': 'Backslash-Entity',
    'tool.backslash-encode.description':
      'Encodiere/Decodiere Backslash-Entities',
    'tool.jwt-decoder-encode.description':
      'Encodiere/Decodiere Java-Web-Tokens',
    'tool.jwt-decoder-encode.missingAttribute':
      'JWT-Tokenizing, fehlendes Attribut: {{attribute}}',
    'tool.jwt-decoder-encode.encodeError':
      'JWT-Tokenizing, Encoding Fehler: {{error}}',
    'tool.jwt-decoder-encode.decodeError':
      'JWT-Tokenizing, Decoding Fehler: {{error}}',
    'tool.markdown-preview.name': 'Markdown',
    'tool.markdown-preview.description': 'Markdown Previewer HTML',
    'tool.csv-to-json-convert.name': 'CSV -> JSON',
    'tool.csv-to-json-convert.description': 'Konvertiere CSV nach JSON',
    'tool.xml-to-json-convert.name': 'XML -> JSON',
    'tool.xml-to-json-convert.description': 'Konvertiere XML nach JSON',
    'tool.xml-to-json-convert.invalidFormat': 'Falsches Format!',
    'tool.json-to-yaml-convert.name': 'JSON -> YAML',
    'tool.json-to-yaml-convert.description': 'Konvertiere JSON nach YAML',
    'tool.yaml-to-json-convert.name': 'YAML -> JSON',
    'tool.yaml-to-json-convert.description': 'Konvertiere YAML nach JSON',
    'tool.rich-text-to-markdown-convert.name': 'HTML -> Markdown',
    'tool.rich-text-to-markdown-convert.description':
      'Konvertiere HTML nach Markdown',
    'tool.rich-text-to-markdown-convert.preview': 'HTML -> Markdown Voranzeige',
    'tool.number-base-convert.name': 'Zahlensystemkonverter',
    'tool.number-base-convert.description':
      'Konvertiere zwischen verschiedenen Zahlensystemen (Hex/Dez/Bin/Okt)',
    'tool.number-base-convert.base2': 'Base 2 (binär)',
    'tool.number-base-convert.base8': 'Base 8 (oktal)',
    'tool.number-base-convert.base10': 'Base 10 (dezimal)',
    'tool.number-base-convert.base16': 'Base 16 (hexadezimal)',
    'tool.string-utilities-convert.name': 'String-Konverter',
    'tool.string-utilities-convert.description':
      'Konvertiere String in andere Darstellungen',
    'tool.string-utilities-convert.inputSearch': 'Suche',
    'tool.string-utilities-convert.inputReplace': 'Ersatz',
    'tool.string-analyzer.name': 'String-Analyzer für Statistik',
    'tool.string-analyzer.description': 'String-Analyzer für Statistik',
    'tool.string-analyzer.overallStats': 'Statistikübersicht',
    'tool.string-analyzer.characterStats': 'Einzel-Zeichen-Statistik',
    'tool.time-convert.name': 'Zeitkonverter',
    'tool.time-convert.description':
      'Zeitkonverter um Zeit in die verschiedenen Repräsentationen zu bringen',
    'tool.time-convert.labelNow': 'Jetzt',
    'tool.time-convert.labelInput': 'Eingabe',
    'tool.time-convert.inputType': 'Eingabe-Zeit',
    'tool.time-convert.unixTime': 'Unixzeit',
    'tool.time-convert.millisecondsTime': 'Millisekunden',
    'tool.time-convert.outputLabel.local': 'Lokalzeit',
    'tool.time-convert.outputLabel.unix': 'Unixzeit',
    'tool.time-convert.outputLabel.dayOfTheWeek': 'Wochentag',
    'tool.time-convert.outputLabel.weekNumber': 'Wochennummer',
    'tool.time-convert.outputLabel.quarter': 'Quartal',
    'tool.time-convert.outputLabel.dayOfTheYear': 'Tag im Jahr',
    'tool.time-convert.outputLabel.leapYear': 'Schaltjahr',
    'tool.time-convert.outputLabel.timezone': 'Zeitzone',
    'tool.color-convert.name': 'Farbkonvertierung',
    'tool.color-convert.description': 'Konvertieren von Farbcodes',
    'tool.color-convert.inputLabel': 'Eingabe',
    'tool.sla-calculator.name': 'SLA-Vereinbarungen',
    'tool.sla-calculator.description': 'Service Level Agreements Kalkulator',
    'tool.sla-calculator.invalidFormat': 'Falsches Format!',
    'tool.sla-calculator.maxValueError': 'Maximaler Wert 100!',
    'tool.sla-calculator.inputLabel': 'SLA in Prozent',
    'tool.sla-calculator.dailyLabel': 'Täglich',
    'tool.sla-calculator.weeklyLabel': 'Wöchentlich',
    'tool.sla-calculator.monthlyLabel': 'Monatlich',
    'tool.sla-calculator.quarterlyLabel': 'jedes Quartal',
    'tool.sla-calculator.yearlyLabel': 'Jährlich',
    'tool.entity-validator.name': 'Entity-Validator',
    'tool.entity-validator.description': 'Validieren von YAML Entities',
    'tool.entity-validator.headerFormatButton': 'Entity Headerformat',
    'tool.entity-validator.inputLabel': 'Eingabe YAML',
    'tool.entity-validator.alertEmptyValue': 'Leeres Feld',
    'tool.entity-validator.alertSuccessTitle': 'Erfolg!',
    'tool.entity-validator.alertErrorTitle': 'Fehler!',
    'tool.entity-validator.alertValidEntity': 'Entity valide!',
    'tool.entity-describer.name': 'Entity-Describer',
    'tool.entity-describer.description':
      'Zeigt existierende Entity Beschreibungen in YAML',
    'tool.entity-describer.entityLabel': 'Entity',
    'tool.entity-describer.outputLabel': 'Ausgabe',
    'tool.qr-code-generate.name': 'QR-Codes',
    'tool.qr-code-generate.description': 'Generieren von QR-Codes',
    'tool.bar-code-generate.name': 'Barcodes',
    'tool.bar-code-generate.description': 'Generieren von Barcodes',
    'tool.lorem-ipsum-generate.description':
      'Generator für Fließtext (Lorem Ipsum)',
    'tool.lorem-ipsum-generate.button.line': 'Zeile',
    'tool.lorem-ipsum-generate.button.paragraph': 'Absatz',
    'tool.lorem-ipsum-generate.button.word': 'Wort',
    'tool.lorem-ipsum-generate.button.datetime': 'Datum/Zeit',
    'tool.lorem-ipsum-generate.button.number': 'Nummer',
    'tool.lorem-ipsum-generate.button.string': 'Textstring',
    'tool.lorem-ipsum-generate.button.password': 'Passwort',
    'tool.lorem-ipsum-generate.button.address': 'Adresse',
    'tool.lorem-ipsum-generate.button.name': 'Name',
    'tool.lorem-ipsum-generate.button.job-title': 'Jobtitel',
    'tool.lorem-ipsum-generate.button.product-name': 'Produktname',
    'tool.lorem-ipsum-generate.button.product-description':
      'Produktbeschreibung',
    'tool.lorem-ipsum-generate.button.catch-phrase': 'Begriff',
    'tool.lorem-ipsum-generate.button.song': 'Songtitel',
    'tool.lorem-ipsum-generate.button.credit-card': 'Kreditkartennummer',
    'tool.hash-generate.description': 'Hash-Generator',
    'tool.interface-generate.name': 'JSON-Interfaces',
    'tool.interface-generate.description':
      'Generiere Interfaces für JSON-Strukturen',
    'tool.format-js.description': 'Javascript/Json-Formatter',
    'tool.format-js.inputLabel': 'Eingabe',
    'tool.format-js.outputLabel': 'Ausgabe',
    'tool.format-html.description': 'HTML-Formatter',
    'tool.format-html.inputLabel': 'Eingabe',
    'tool.format-html.outputLabel': 'Ausgabe',
    'tool.format-css.description': 'CSS-Formatter',
    'tool.format-css.inputLabel': 'Eingabe',
    'tool.format-css.outputLabel': 'Ausgabe',
    'tool.format-sql.description': 'SQL-Formatter',
    'tool.format-sql.inputLabel': 'Eingabe',
    'tool.format-sql.outputLabel': 'Ausgabe',
    'tool.countdown.name': 'Countdown',
    'tool.countdown.description': 'Ablauf-Stoppuhr mit Erinnerung',
    'tool.countdown.startButton': 'Start',
    'tool.countdown.stopButton': 'Stopp',
    'tool.countdown.resetButton': 'Reset',
    'tool.countdown.hoursLabel': 'Stunden',
    'tool.countdown.minutesLabel': 'Minuten',
    'tool.countdown.secondsLabel': 'Sekunden',
    'tool.stopwatch.name': 'Stoppuhr',
    'tool.stopwatch.description': 'Stoppuhr, welche auf einen Wert hochzählt',
    'tool.diff.name': 'Diff-Tool',
    'tool.diff.description': 'Anzeige von Unterschieden',
    'tool.diff.loadingLabel': 'Lade...',
    'tool.diff.selectLanguage': 'Sprache wählen',
    'tool.diff.originalFileUploadButton': 'Datei 1 upload',
    'tool.diff.modifiedFileUploadButton': 'Datei 2 upload',
    'tool.iban.name': 'IBAN Validierung',
    'tool.iban.description': 'Validierung über IBAN ISO 13616 Standard',
    'tool.iban.alertErrorTitle': 'Fehler!',
    'tool.iban.alertInvalidIBAN': 'Ungültige IBAN eingegeben!',
    'tool.regex.name': 'Regex-Validator',
    'tool.regex.description': 'Validierung eines Regex Pattern',
    'tool.regex.patternDoesntMatch': 'der Pattern stimmt gar nicht überein',
    'tool.regex.patternNoMatchOrEmpty': 'keine Übereinstimmung oder leer',
    'tool.regex.patternMatch':
      '{{myNum}}. Treffer={{myRes}} bei Index={{myIdx}}\n',
    'tool.regex.exceptionError':
      "Validierung ergab Exception\n\nMsg='{{errorMsg}}'",
    'tool.regex.inputField': 'Eingabe',
    'tool.regex.outputField': 'Ausgabe',
    'tool.regex.patternField': 'Pattern',
    'tool.regex.sampleField':
      'dies ist ein Textbeispiel zum Test des Patternmatching',
    'tool.url-exploder.name': 'URL Exploder',
    'tool.url-exploder.description': 'Zerlegen einer URL in seine Bestandteile',
    'tool.url-exploder.pasteFromClipboard': 'Einfügen von Zwischenablage',
    'tool.url-exploder.copyToClipboard': 'Kopieren in die Zwischenablage',
    'tool.url-exploder.protocolLabel': 'Protokoll',
    'tool.url-exploder.pathLabel': 'Pfad',
    'tool.url-exploder.usernameLabel': 'Username',
    'tool.url-exploder.queryLabel': 'Query',
    'tool.url-exploder.queryHelperText':
      'Jeder Parameter in eine eigene Zeile, Format: Key=Value',
    'tool.url-exploder.hostLabel': 'Host',
    'tool.url-exploder.portLabel': 'Port',
    'tool.url-exploder.passwordLabel': 'Passwort',
    'tool.url-exploder.originLabel': 'Quelle',
    'tool.whois.name': 'WHOIS',
    'tool.whois.description': 'Abfrage der WHOIS Domain',
    'tool.whois.lookupButton': 'Suche',
    'tool.whois.exampleButton': 'Beispiel',
  },
});

export default de;
