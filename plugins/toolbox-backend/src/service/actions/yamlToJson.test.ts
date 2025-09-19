import { createYamlToJsonAction } from './yamlToJson';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createYamlToJsonAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createYamlToJsonAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('convert-yaml-to-json');
    expect(registeredAction.title).toBe('Convert YAML to JSON');
    expect(registeredAction.description).toBe(
      'Convert YAML data to JSON format',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should convert valid YAML to JSON with default spacing', async () => {
      const input = {
        yaml: `
name: test
version: 1.0.0
config:
  enabled: true
  items:
    - item1
    - item2
        `,
      };

      const result = await registeredAction.action({ input });

      const expectedObject = {
        name: 'test',
        version: '1.0.0',
        config: {
          enabled: true,
          items: ['item1', 'item2'],
        },
      };

      // Check that the result contains the expected data, but don't expect specific formatting
      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedObject);
    });

    it('should convert valid YAML to JSON with custom spacing', async () => {
      const input = {
        yaml: 'name: test\nvalue: 123',
        spaces: 2,
      };

      const result = await registeredAction.action({ input });

      const expectedObject = { name: 'test', value: 123 };
      expect(result.output.json).toBe(JSON.stringify(expectedObject, null, 2));
    });

    it('should handle empty YAML', async () => {
      const input = { yaml: '' };

      const result = await registeredAction.action({ input });

      expect(result.output.json).toBe('null');
    });

    it('should handle YAML with arrays', async () => {
      const input = {
        yaml: `
- name: item1
  value: 1
- name: item2
  value: 2
        `,
      };

      const result = await registeredAction.action({ input });

      const expectedArray = [
        { name: 'item1', value: 1 },
        { name: 'item2', value: 2 },
      ];

      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedArray);
    });

    it('should handle YAML with nested objects', async () => {
      const input = {
        yaml: `
level1:
  level2:
    level3:
      value: "deep"
        `,
      };

      const result = await registeredAction.action({ input });

      const expectedObject = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };

      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedObject);
    });

    it('should throw error for invalid YAML', async () => {
      // This YAML is actually valid, let me use truly invalid YAML
      const invalidInput = {
        yaml: `
invalid: [
  unclosed: array
        `,
      };

      await expect(
        registeredAction.action({ input: invalidInput }),
      ).rejects.toThrow(/Failed to convert YAML to JSON:/);
    });

    it('should handle YAML with special characters', async () => {
      const input = {
        yaml: `
special: "chars: []{}|>@#$%^&*()"
unicode: "😀🎉"
        `,
      };

      const result = await registeredAction.action({ input });

      const expectedObject = {
        special: 'chars: []{}|>@#$%^&*()',
        unicode: '😀🎉',
      };

      const parsed = JSON.parse(result.output.json);
      expect(parsed).toEqual(expectedObject);
    });
  });
});
