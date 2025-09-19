import { createCsvToJsonAction } from './csvToJson';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createCsvToJsonAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createCsvToJsonAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('convert-csv-to-json');
    expect(registeredAction.title).toBe('Convert CSV to JSON');
    expect(registeredAction.description).toBe(
      'Convert CSV data to JSON format',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should convert valid CSV to JSON with default spacing', async () => {
      const input = {
        csv: `name,age,city
John,30,New York
Jane,25,Los Angeles
Bob,35,Chicago`,
      };

      const result = await registeredAction.action({ input });

      const expectedArray = [
        { name: 'John', age: '30', city: 'New York' },
        { name: 'Jane', age: '25', city: 'Los Angeles' },
        { name: 'Bob', age: '35', city: 'Chicago' },
      ];

      // Check that the parsed result matches expected data
      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedArray);
    });

    it('should convert CSV to JSON with custom spacing', async () => {
      const input = {
        csv: `id,value
1,test
2,another`,
        spaces: 4,
      };

      const result = await registeredAction.action({ input });

      const expectedArray = [
        { id: '1', value: 'test' },
        { id: '2', value: 'another' },
      ];
      expect(result.output.json).toBe(JSON.stringify(expectedArray, null, 4));
    });

    it('should handle CSV with quoted values', async () => {
      const input = {
        csv: `name,description
"John Doe","A person with, comma in description"
"Jane Smith","Another person with ""quotes"""`,
      };

      const result = await registeredAction.action({ input });

      const expectedArray = [
        {
          name: 'John Doe',
          description: 'A person with, comma in description',
        },
        { name: 'Jane Smith', description: 'Another person with "quotes"' },
      ];

      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedArray);
    });

    it('should handle empty CSV', async () => {
      const input = { csv: '' };

      const result = await registeredAction.action({ input });

      expect(result.output.json).toBe('[]');
    });

    it('should handle CSV with only headers', async () => {
      const input = { csv: 'name,age,city' };

      const result = await registeredAction.action({ input });

      expect(result.output.json).toBe('[]');
    });

    it('should handle CSV with empty values', async () => {
      const input = {
        csv: `name,age,city
John,,New York
,25,
Bob,35,Chicago`,
      };

      const result = await registeredAction.action({ input });

      const expectedArray = [
        { name: 'John', age: '', city: 'New York' },
        { name: '', age: '25', city: '' },
        { name: 'Bob', age: '35', city: 'Chicago' },
      ];

      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedArray);
    });

    it('should handle CSV with special characters', async () => {
      const input = {
        csv: `name,symbols,unicode
Test,"!@#$%^&*()",😀
Another,"<>[]{}|\\",🎉`,
      };

      const result = await registeredAction.action({ input });

      const expectedArray = [
        { name: 'Test', symbols: '!@#$%^&*()', unicode: '😀' },
        { name: 'Another', symbols: '<>[]{}|\\', unicode: '🎉' },
      ];

      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedArray);
    });
  });
});
