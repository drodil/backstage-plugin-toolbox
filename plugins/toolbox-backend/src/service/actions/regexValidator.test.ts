import { createRegexValidatorAction } from './regexValidator';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createRegexValidatorAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createRegexValidatorAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('validate-regex');
    expect(registeredAction.title).toBe('Validate Regex');
    expect(registeredAction.description).toBe(
      'Test regex patterns against input text and extract matches',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should validate and match simple regex pattern', async () => {
      const input = {
        text: 'Hello World 123',
        pattern: '\\d+',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(1);
      expect(result.output.matches[0].match).toBe('123');
      expect(result.output.matches[0].index).toBe(12);
    });

    it('should handle multiple matches with global flag', async () => {
      const input = {
        text: 'Phone: 123-456-7890, Fax: 098-765-4321',
        pattern: '\\d{3}-\\d{3}-\\d{4}',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(2);
      expect(result.output.matches[0].match).toBe('123-456-7890');
      expect(result.output.matches[1].match).toBe('098-765-4321');
    });

    it('should handle capture groups', async () => {
      const input = {
        text: 'Email: john.doe@example.com',
        pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(1);
      expect(result.output.matches[0].match).toBe('john.doe@example.com');
      expect(result.output.matches[0].groups).toEqual([
        'john.doe',
        'example.com',
      ]);
    });

    it('should handle case insensitive matching', async () => {
      const input = {
        text: 'Hello WORLD hello world',
        pattern: 'hello',
        flags: 'gi',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(2);
      expect(result.output.matches[0].match).toBe('Hello');
      expect(result.output.matches[1].match).toBe('hello');
    });

    it('should handle multiline matching', async () => {
      const input = {
        text: 'Line 1\nLine 2\nLine 3',
        pattern: '^Line',
        flags: 'gm',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(3);
    });

    it('should handle no matches found', async () => {
      const input = {
        text: 'Hello World',
        pattern: '\\d+',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(false);
      expect(result.output.matches).toHaveLength(0);
    });

    it('should handle invalid regex pattern', async () => {
      const input = {
        text: 'Hello World',
        pattern: '[invalid',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(false);
      expect(result.output.hasMatches).toBe(false);
      expect(result.output.matches).toHaveLength(0);
      expect(result.output.error).toBeDefined();
    });

    it('should handle empty text', async () => {
      const input = {
        text: '',
        pattern: '\\w+',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(false);
      expect(result.output.matches).toHaveLength(0);
    });

    it('should handle empty pattern', async () => {
      const input = {
        text: 'Hello World',
        pattern: '',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      // Empty pattern matches at every position
      expect(result.output.matches.length).toBeGreaterThan(0);
    });

    it('should handle special regex characters', async () => {
      const input = {
        text: 'Price: $19.99 and $29.99',
        pattern: '\\$\\d+\\.\\d{2}',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(2);
      expect(result.output.matches[0].match).toBe('$19.99');
      expect(result.output.matches[1].match).toBe('$29.99');
    });

    it('should handle unicode characters', async () => {
      const input = {
        text: 'Hello 世界 🌍 World',
        pattern: '[\\u4e00-\\u9fff]+',
        flags: 'g',
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(1);
      expect(result.output.matches[0].match).toBe('世界');
    });

    it('should prevent infinite loops with non-global patterns', async () => {
      const input = {
        text: 'aaa bbb ccc',
        pattern: 'a+',
        flags: '', // No global flag
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.hasMatches).toBe(true);
      expect(result.output.matches).toHaveLength(1); // Should only find first match
      expect(result.output.matches[0].match).toBe('aaa');
    });
  });
});
