import { createStringAnalyzerAction } from './stringAnalyzer';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createStringAnalyzerAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createStringAnalyzerAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('analyze-string');
    expect(registeredAction.title).toBe('Analyze String');
    expect(registeredAction.description).toBe(
      'Analyze text for character counts, lines, words, and character frequency',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should analyze simple text correctly', async () => {
      const input = { text: 'Hello World!' };

      const result = await registeredAction.action({ input });

      expect(result.output.characters).toBe(12);
      expect(result.output.lines).toBe(1);
      expect(result.output.words).toBe(2);
      expect(result.output.characterFrequency).toBeDefined();
      expect(Array.isArray(result.output.characterFrequency)).toBe(true);
    });

    it('should handle empty string', async () => {
      const input = { text: '' };

      const result = await registeredAction.action({ input });

      expect(result.output.characters).toBe(0);
      expect(result.output.lines).toBe(0);
      expect(result.output.words).toBe(0);
      expect(result.output.characterFrequency).toBeDefined();
    });

    it('should count lines correctly', async () => {
      const input = {
        text: `Line 1
Line 2
Line 3`,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.lines).toBe(3);
      expect(result.output.words).toBe(6);
      expect(result.output.characters).toBe(20); // Including newlines
    });

    it('should handle different line endings', async () => {
      const texts = [
        'Line 1\nLine 2\nLine 3', // Unix
        'Line 1\r\nLine 2\r\nLine 3', // Windows
        'Line 1\rLine 2\rLine 3', // Old Mac
      ];

      for (const text of texts) {
        const result = await registeredAction.action({ input: { text } });
        expect(result.output.lines).toBe(3);
      }
    });

    it('should count words correctly', async () => {
      const testCases = [
        { text: 'one', words: 1 },
        { text: 'one two', words: 2 },
        { text: 'one  two   three', words: 3 }, // Multiple spaces
        { text: '  one two  ', words: 2 }, // Leading/trailing spaces
        { text: 'one\ttwo\nthree', words: 3 }, // Tabs and newlines
        { text: '', words: 0 },
        { text: '   ', words: 0 }, // Only whitespace
      ];

      for (const { text, words } of testCases) {
        const result = await registeredAction.action({ input: { text } });
        expect(result.output.words).toBe(words);
      }
    });

    it('should analyze character frequency correctly', async () => {
      const input = { text: 'HELLO WORLD!' };

      const result = await registeredAction.action({ input });

      const frequency = result.output.characterFrequency;

      // Find specific character counts
      const hCount = frequency.find((f: any) => f.char === 'H')?.count || 0;
      const eCount = frequency.find((f: any) => f.char === 'E')?.count || 0;
      const lCount = frequency.find((f: any) => f.char === 'L')?.count || 0;
      const oCount = frequency.find((f: any) => f.char === 'O')?.count || 0;
      const spaceCount =
        frequency.find((f: any) => f.char === 'Whitespace')?.count || 0;
      const exclamationCount =
        frequency.find((f: any) => f.char === '!')?.count || 0;

      expect(hCount).toBe(1);
      expect(eCount).toBe(1);
      expect(lCount).toBe(3);
      expect(oCount).toBe(2);
      expect(spaceCount).toBe(1);
      expect(exclamationCount).toBe(1);
    });

    it('should handle case-insensitive character counting', async () => {
      const input = { text: 'AaAa' };

      const result = await registeredAction.action({ input });

      const frequency = result.output.characterFrequency;
      const aCount = frequency.find((f: any) => f.char === 'A')?.count || 0;

      expect(aCount).toBe(4); // Should count both 'A' and 'a'
    });

    it('should count special characters correctly', async () => {
      const input = { text: 'Hello! How are you? Fine: $100 (maybe)' };

      const result = await registeredAction.action({ input });

      const frequency = result.output.characterFrequency;

      const exclamationCount =
        frequency.find((f: any) => f.char === '!')?.count || 0;
      const questionCount =
        frequency.find((f: any) => f.char === '?')?.count || 0;
      const colonCount = frequency.find((f: any) => f.char === ':')?.count || 0;
      const dollarCount =
        frequency.find((f: any) => f.char === '$')?.count || 0;
      const parenCount = frequency.find((f: any) => f.char === '(')?.count || 0;

      expect(exclamationCount).toBe(1);
      expect(questionCount).toBe(1);
      expect(colonCount).toBe(1);
      expect(dollarCount).toBe(1);
      expect(parenCount).toBe(1);
    });

    it('should count "Others" category for characters not in analyzed set', async () => {
      const input = { text: 'Hello @#% 世界' }; // Contains unicode and special chars

      const result = await registeredAction.action({ input });

      const frequency = result.output.characterFrequency;
      const othersCount =
        frequency.find((f: any) => f.char === 'Others')?.count || 0;

      expect(othersCount).toBeGreaterThan(0); // Should count unicode chars and @#%
    });

    it('should handle numbers correctly', async () => {
      const input = { text: '123 456 789 000' };

      const result = await registeredAction.action({ input });

      const frequency = result.output.characterFrequency;

      const oneCount = frequency.find((f: any) => f.char === '1')?.count || 0;
      const twoCount = frequency.find((f: any) => f.char === '2')?.count || 0;
      const zeroCount = frequency.find((f: any) => f.char === '0')?.count || 0;

      expect(oneCount).toBe(1);
      expect(twoCount).toBe(1);
      expect(zeroCount).toBe(3);
    });

    it('should handle long text efficiently', async () => {
      const longText = 'A'.repeat(10000) + 'B'.repeat(5000) + ' '.repeat(1000);
      const input = { text: longText };

      const result = await registeredAction.action({ input });

      expect(result.output.characters).toBe(16000);

      const frequency = result.output.characterFrequency;
      const aCount = frequency.find((f: any) => f.char === 'A')?.count || 0;
      const bCount = frequency.find((f: any) => f.char === 'B')?.count || 0;
      const spaceCount =
        frequency.find((f: any) => f.char === 'Whitespace')?.count || 0;

      expect(aCount).toBe(10000);
      expect(bCount).toBe(5000);
      expect(spaceCount).toBe(1000);
    });

    it('should handle text with only whitespace', async () => {
      const input = { text: '   \t\n\r  ' };

      const result = await registeredAction.action({ input });

      expect(result.output.characters).toBe(8);
      expect(result.output.words).toBe(0);
      expect(result.output.lines).toBe(3); // \n and \r create line breaks

      const frequency = result.output.characterFrequency;
      const spaceCount =
        frequency.find((f: any) => f.char === 'Whitespace')?.count || 0;

      expect(spaceCount).toBeGreaterThan(0);
    });

    it('should handle mixed content correctly', async () => {
      const input = {
        text: `Hello World! 123
This is a test: $100.50
Special chars: @#%^&*()
Unicode: 😀🎉 世界`,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.characters).toBeGreaterThan(0);
      expect(result.output.lines).toBe(4);
      expect(result.output.words).toBeGreaterThan(10);

      const frequency = result.output.characterFrequency;
      // The actual number of analyzed chars plus Others category
      expect(frequency.length).toBeGreaterThan(50); // Should be around 56

      // Check that Others category captures unicode and special chars
      const othersCount =
        frequency.find((f: any) => f.char === 'Others')?.count || 0;
      expect(othersCount).toBeGreaterThan(0);
    });

    it('should provide complete character frequency analysis', async () => {
      const input = { text: 'Test 123!' };

      const result = await registeredAction.action({ input });

      const frequency = result.output.characterFrequency;

      // Should have all analyzed characters plus Others (55 + 1 = 56)
      expect(frequency.length).toBeGreaterThan(50);

      // Each entry should have char and count properties
      frequency.forEach((entry: any) => {
        expect(entry).toHaveProperty('char');
        expect(entry).toHaveProperty('count');
        expect(typeof entry.char).toBe('string');
        expect(typeof entry.count).toBe('number');
        expect(entry.count).toBeGreaterThanOrEqual(0);
      });

      // Total count should equal text length
      const totalCount = frequency.reduce(
        (sum: any, entry: any) => sum + entry.count,
        0,
      );
      expect(totalCount).toBe(input.text.length);
    });
  });
});
