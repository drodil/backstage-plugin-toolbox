import { toLocationRef } from './locationRef';

describe('toLocationRef', () => {
  it.each([
    ['empty input', ''],
    ['only whitespace', '   '],
  ])('falls back to the placeholder location for %s', (_, input) => {
    expect(toLocationRef(input)).toBe('url:https://localhost/entity-validator');
  });

  it('prefixes a given URL and trims surrounding whitespace', () => {
    expect(
      toLocationRef(
        ' https://github.com/org/repo/blob/main/catalog-info.yaml ',
      ),
    ).toBe('url:https://github.com/org/repo/blob/main/catalog-info.yaml');
  });
});
