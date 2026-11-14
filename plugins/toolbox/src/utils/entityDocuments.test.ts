import {
  EntityDocument,
  labelErrors,
  parseEntityDocuments,
} from './entityDocuments';

const component = 'kind: Component\nmetadata:\n  name: a\n';
const api = 'kind: API\nmetadata:\n  name: b\n';

describe('parseEntityDocuments', () => {
  it.each([
    ['empty input', ''],
    ['only comments', '# nothing here\n'],
    ['only separators', '---\n---\n'],
  ])('returns no documents for %s', (_, input) => {
    expect(parseEntityDocuments(input)).toEqual([]);
  });

  it.each([
    ['a single entity', component],
    ['a leading separator', `---\n${component}`],
    ['a trailing separator', `${component}---\n`],
    ['a document end marker', `${component}...\n`],
  ])('returns one entity for %s', (_, input) => {
    expect(parseEntityDocuments(input)).toEqual([
      {
        type: 'entity',
        label: 'Component:a',
        entity: { kind: 'Component', metadata: { name: 'a' } },
      },
    ]);
  });

  it('returns every entity of a multi-document file', () => {
    expect(
      parseEntityDocuments(`${component}---\n${api}`).map(d => d.label),
    ).toEqual(['Component:a', 'API:b']);
  });

  it('labels documents without kind and name by position', () => {
    expect(
      parseEntityDocuments(`${component}---\nmetadata:\n  name: b\n`),
    ).toEqual([
      expect.objectContaining({ label: 'Component:a' }),
      expect.objectContaining({ type: 'entity', label: '#2' }),
    ]);
  });

  it.each([
    ['an array', '- a\n- b\n', 'array'],
    ['a scalar', 'just text\n', 'string'],
  ])('reports %s at the root as an error', (_, input, rootType) => {
    expect(parseEntityDocuments(input)).toEqual([
      {
        type: 'error',
        label: '#1',
        error: {
          name: 'InputError',
          message: `Expected object at root, got ${rootType}`,
        },
      },
    ]);
  });

  it('reports a malformed document without dropping the others', () => {
    const [first, second] = parseEntityDocuments(`${component}---\nkind: [\n`);
    expect(first).toEqual(expect.objectContaining({ type: 'entity' }));
    expect(second).toEqual(
      expect.objectContaining({ type: 'error', label: '#2' }),
    );
  });
});

describe('labelErrors', () => {
  const error = { name: 'InputError', message: 'boom' };
  const doc = (label: string): EntityDocument => ({
    type: 'error',
    label,
    error,
  });

  it('leaves errors of a single entity unlabelled', () => {
    expect(labelErrors([doc('Component:a')], [[error]])).toEqual([error]);
  });

  it('prefixes errors with their entity once there are several', () => {
    expect(
      labelErrors([doc('Component:a'), doc('API:b')], [[], [error]]),
    ).toEqual([{ name: 'API:b InputError', message: 'boom' }]);
  });
});
