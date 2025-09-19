import { createJsonToYamlAction } from './jsonToYaml';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createJsonToYamlAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createJsonToYamlAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('convert-json-to-yaml');
    expect(registeredAction.title).toBe('Convert JSON to YAML');
    expect(registeredAction.description).toBe(
      'Convert JSON data to YAML format',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should convert valid JSON object to YAML', async () => {
      const input = {
        json: JSON.stringify({
          name: 'test',
          version: '1.0.0',
          config: {
            enabled: true,
            items: ['item1', 'item2'],
          },
        }),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml).toContain('name: test');
      expect(result.output.yaml).toContain('version: 1.0.0');
      expect(result.output.yaml).toContain('enabled: true');
      expect(result.output.yaml).toContain('- item1');
      expect(result.output.yaml).toContain('- item2');
    });

    it('should convert JSON array to YAML', async () => {
      const input = {
        json: JSON.stringify([
          { name: 'item1', value: 1 },
          { name: 'item2', value: 2 },
        ]),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml).toContain('- name: item1');
      expect(result.output.yaml).toContain('  value: 1');
      expect(result.output.yaml).toContain('- name: item2');
      expect(result.output.yaml).toContain('  value: 2');
    });

    it('should handle simple JSON values', async () => {
      const inputs = [
        { json: '"string value"', expected: 'string value' },
        { json: '123', expected: '123' },
        { json: 'true', expected: 'true' },
        { json: 'null', expected: 'null' },
      ];

      for (const { json, expected } of inputs) {
        const result = await registeredAction.action({ input: { json } });
        expect(result.output.yaml.trim()).toBe(expected);
      }
    });

    it('should handle empty JSON object', async () => {
      const input = { json: '{}' };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml.trim()).toBe('{}');
    });

    it('should handle empty JSON array', async () => {
      const input = { json: '[]' };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml.trim()).toBe('[]');
    });

    it('should handle nested JSON objects', async () => {
      const input = {
        json: JSON.stringify({
          level1: {
            level2: {
              level3: {
                value: 'deep',
              },
            },
          },
        }),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml).toContain('level1:');
      expect(result.output.yaml).toContain('level2:');
      expect(result.output.yaml).toContain('level3:');
      expect(result.output.yaml).toContain('value: deep');
    });

    it('should handle JSON with special characters', async () => {
      const input = {
        json: JSON.stringify({
          special: 'chars: []{}|>@#$%^&*()',
          unicode: '😀🎉',
          quotes: 'string with "quotes"',
        }),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml).toContain('special: "chars: []{}|>@#$%^&*()"');
      expect(result.output.yaml).toContain('unicode: 😀🎉');
      expect(result.output.yaml).toContain('quotes: string with "quotes"');
    });

    it('should handle JSON with null and boolean values', async () => {
      const input = {
        json: JSON.stringify({
          nullValue: null,
          trueValue: true,
          falseValue: false,
          undefinedValue: undefined,
        }),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml).toContain('nullValue: null');
      expect(result.output.yaml).toContain('trueValue: true');
      expect(result.output.yaml).toContain('falseValue: false');
    });

    it('should handle JSON with numeric values', async () => {
      const input = {
        json: JSON.stringify({
          integer: 42,
          float: 3.14,
          negative: -10,
          zero: 0,
          scientific: 1.23e-4,
        }),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml).toContain('integer: 42');
      expect(result.output.yaml).toContain('float: 3.14');
      expect(result.output.yaml).toContain('negative: -10');
      expect(result.output.yaml).toContain('zero: 0');
      expect(result.output.yaml).toContain('scientific: 0.000123');
    });

    it('should throw error for invalid JSON', async () => {
      const input = { json: 'invalid json string' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Failed to convert JSON to YAML:/,
      );
    });

    it('should throw error for malformed JSON', async () => {
      const input = { json: '{"name": "John", "age":}' };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Failed to convert JSON to YAML:/,
      );
    });

    it('should handle complex nested structures', async () => {
      const input = {
        json: JSON.stringify({
          users: [
            {
              id: 1,
              name: 'John',
              address: {
                street: '123 Main St',
                city: 'New York',
                coordinates: { lat: 40.7128, lng: -74.006 },
              },
              hobbies: ['reading', 'swimming'],
            },
            {
              id: 2,
              name: 'Jane',
              address: {
                street: '456 Oak Ave',
                city: 'Los Angeles',
                coordinates: { lat: 34.0522, lng: -118.2437 },
              },
              hobbies: ['cooking', 'dancing'],
            },
          ],
        }),
      };

      const result = await registeredAction.action({ input });

      expect(result.output.yaml).toContain('users:');
      expect(result.output.yaml).toContain('- id: 1');
      expect(result.output.yaml).toContain('  name: John');
      expect(result.output.yaml).toContain('  address:');
      expect(result.output.yaml).toContain('    street: 123 Main St');
      expect(result.output.yaml).toContain('    coordinates:');
      expect(result.output.yaml).toContain('      lat: 40.7128');
      expect(result.output.yaml).toContain('  hobbies:');
      expect(result.output.yaml).toContain('  - reading');
    });
  });
});
