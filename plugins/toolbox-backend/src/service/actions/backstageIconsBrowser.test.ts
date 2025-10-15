import { createBackstageIconsAction } from './backstageIconsBrowser';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createBackstageIconsAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createBackstageIconsAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('icons-list');
    expect(registeredAction.title).toBe('Icons list');
    expect(registeredAction.description).toBe('Shows all Backstage icons');
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should return an empty icons array', async () => {
      const result = await registeredAction.action({});

      expect(result).toEqual({
        output: {
          icons: [],
        },
      });
    });

    it('should return output with icons property', async () => {
      const result = await registeredAction.action({});

      expect(result.output).toHaveProperty('icons');
      expect(Array.isArray(result.output.icons)).toBe(true);
    });

    it('should handle action call without input', async () => {
      const result = await registeredAction.action({});

      expect(result).toBeDefined();
      expect(result.output).toBeDefined();
      expect(result.output.icons).toEqual([]);
    });

    it('should be idempotent - multiple calls return same result', async () => {
      const result1 = await registeredAction.action({});
      const result2 = await registeredAction.action({});

      expect(result1).toEqual(result2);
    });
  });

  describe('schema validation', () => {
    it('should have correct input schema', () => {
      expect(registeredAction.schema).toBeDefined();
      expect(registeredAction.schema.input).toBeDefined();
    });

    it('should have correct output schema', () => {
      expect(registeredAction.schema).toBeDefined();
      expect(registeredAction.schema.output).toBeDefined();
    });
  });
});
