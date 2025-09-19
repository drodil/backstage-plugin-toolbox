import { createJsonToCsvAction } from './jsonToCsv';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createJsonToCsvAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createJsonToCsvAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('convert-json-to-csv');
    expect(registeredAction.title).toBe('Convert JSON to CSV');
    expect(registeredAction.description).toBe(
      'Convert JSON data to CSV format',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should convert valid JSON array to CSV', async () => {
      const input = {
        json: JSON.stringify([
          { name: 'John', age: 30, city: 'New York' },
          { name: 'Jane', age: 25, city: 'Los Angeles' },
          { name: 'Bob', age: 35, city: 'Chicago' },
        ]),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.csv).toContain('"name","age","city"');
      expect(result.output.csv).toContain('"John",30,"New York"');
      expect(result.output.csv).toContain('"Jane",25,"Los Angeles"');
      expect(result.output.csv).toContain('"Bob",35,"Chicago"');
    });

    it('should convert single JSON object to CSV', async () => {
      const input = {
        json: JSON.stringify({ name: 'John', age: 30, city: 'New York' }),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.csv).toContain('"name","age","city"');
      expect(result.output.csv).toContain('"John",30,"New York"');
    });

    it('should handle JSON with nested objects (flattened)', async () => {
      const input = {
        json: JSON.stringify([
          {
            name: 'John',
            address: { street: '123 Main St', city: 'New York' },
            contact: { email: 'john@example.com' },
          },
        ]),
      };

      const result = await registeredAction.action({ input });

      // The JSON2CSV library stringifies nested objects rather than flattening them
      expect(result.output.csv).toContain('"name","address","contact"');
      expect(result.output.csv).toContain('"John"');
    });

    it('should handle empty JSON array', async () => {
      const input = { json: '[]' };

      // Empty arrays should throw an error as there are no fields to determine
      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Failed to convert JSON to CSV:/,
      );
    });

    it('should handle JSON with special characters', async () => {
      const input = {
        json: JSON.stringify([
          { name: 'John "Doe"', description: 'Person, with commas' },
          { name: 'Jane\nSmith', description: 'Person\nwith\nnewlines' },
        ]),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.csv).toContain('"name","description"');
      expect(result.output.csv).toContain('"John ""Doe"""');
      expect(result.output.csv).toContain('"Person, with commas"');
    });

    it('should handle JSON with null and undefined values', async () => {
      const input = {
        json: JSON.stringify([
          { name: 'John', age: null, city: undefined },
          { name: 'Jane', age: 25, city: 'Boston' },
        ]),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.csv).toContain('"name","age","city"');
      expect(result.output.csv).toContain('"John",,');
      expect(result.output.csv).toContain('"Jane",25,"Boston"');
    });

    it('should throw error for invalid JSON', async () => {
      const input = {
        json: 'invalid json string',
      };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Failed to convert JSON to CSV:/,
      );
    });

    it('should throw error for malformed JSON', async () => {
      const input = {
        json: '{"name": "John", "age":}',
      };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Failed to convert JSON to CSV:/,
      );
    });

    it('should handle JSON with arrays in values', async () => {
      const input = {
        json: JSON.stringify([
          { name: 'John', hobbies: ['reading', 'swimming'] },
          { name: 'Jane', hobbies: ['cooking', 'dancing', 'singing'] },
        ]),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.csv).toContain('"name","hobbies"');
      // Arrays are stringified by the JSON2CSV library
      expect(result.output.csv).toContain('"John"');
      expect(result.output.csv).toContain('"Jane"');
    });
  });
});
