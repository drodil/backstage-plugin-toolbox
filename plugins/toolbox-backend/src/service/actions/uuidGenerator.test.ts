import { createUuidGeneratorAction } from './uuidGenerator';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createUuidGeneratorAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createUuidGeneratorAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('generate-uuid');
    expect(registeredAction.title).toBe('Generate UUID');
    expect(registeredAction.description).toBe(
      'Generate UUIDs (v4) in various formats',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should generate single UUID with default format', async () => {
      const input = {
        count: 1,
        format: 'standard' as const,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.uuids).toHaveLength(1);
      expect(result.output.uuids[0]).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it('should generate multiple UUIDs', async () => {
      const input = { count: 5 };

      const result = await registeredAction.action({ input });

      expect(result.output.uuids).toHaveLength(5);
      result.output.uuids.forEach((uuid: string) => {
        expect(uuid).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        );
      });
    });

    it('should generate UUID in standard format', async () => {
      const input = {
        count: 1,
        format: 'standard' as const,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.uuids[0]).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it('should generate UUID in uppercase format', async () => {
      const input = {
        count: 1,
        format: 'uppercase' as const,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.uuids[0]).toMatch(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
      );
    });

    it('should generate UUID in nohyphens format', async () => {
      const input = {
        count: 1,
        format: 'nohyphens' as const,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.uuids[0]).toMatch(/^[0-9a-f]{32}$/);
      expect(result.output.uuids[0]).not.toContain('-');
    });

    it('should generate UUID in braces format', async () => {
      const input = {
        count: 1,
        format: 'braces' as const,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.uuids[0]).toMatch(
        /^\{[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\}$/,
      );
    });

    it('should generate unique UUIDs', async () => {
      const input = { count: 100 };

      const result = await registeredAction.action({ input });

      const uniqueUuids = new Set(result.output.uuids);
      expect(uniqueUuids.size).toBe(100);
    });

    it('should handle maximum count constraint', async () => {
      const input = { count: 100 };

      const result = await registeredAction.action({ input });

      expect(result.output.uuids).toHaveLength(100);
    });

    it('should generate valid v4 UUIDs', async () => {
      const input = { count: 10 };

      const result = await registeredAction.action({ input });

      result.output.uuids.forEach((uuid: string) => {
        // Check that it's a valid v4 UUID (version 4)
        const parts = uuid.split('-');
        expect(parts).toHaveLength(5);
        expect(parts[2][0]).toBe('4'); // Version 4
        expect(['8', '9', 'a', 'b']).toContain(parts[3][0]); // Variant bits
      });
    });

    it('should handle different formats with multiple UUIDs', async () => {
      // Test standard format
      const standardInput = { count: 3, format: 'standard' as const };
      const standardResult = await registeredAction.action({
        input: standardInput,
      });
      expect(standardResult.output.uuids).toHaveLength(3);
      standardResult.output.uuids.forEach((uuid: string) => {
        expect(uuid).toMatch(/^[0-9a-f-]+$/);
        expect(uuid).toContain('-');
      });

      // Test uppercase format
      const uppercaseInput = { count: 3, format: 'uppercase' as const };
      const uppercaseResult = await registeredAction.action({
        input: uppercaseInput,
      });
      expect(uppercaseResult.output.uuids).toHaveLength(3);
      uppercaseResult.output.uuids.forEach((uuid: string) => {
        expect(uuid).toMatch(/^[0-9A-F-]+$/);
        expect(uuid).toContain('-');
      });

      // Test nohyphens format
      const nohyphensInput = { count: 3, format: 'nohyphens' as const };
      const nohyphensResult = await registeredAction.action({
        input: nohyphensInput,
      });
      expect(nohyphensResult.output.uuids).toHaveLength(3);
      nohyphensResult.output.uuids.forEach((uuid: string) => {
        expect(uuid).toMatch(/^[0-9a-f]+$/);
        expect(uuid).not.toContain('-');
      });

      // Test braces format
      const bracesInput = { count: 3, format: 'braces' as const };
      const bracesResult = await registeredAction.action({
        input: bracesInput,
      });
      expect(bracesResult.output.uuids).toHaveLength(3);
      bracesResult.output.uuids.forEach((uuid: string) => {
        expect(uuid).toMatch(/^\{[0-9a-f-]+\}$/);
        expect(uuid.startsWith('{')).toBe(true);
        expect(uuid.endsWith('}')).toBe(true);
      });
    });

    it('should maintain UUID structure across formats', async () => {
      const input = { count: 1 };

      // Generate in different formats and verify they represent the same UUID
      const standardResult = await registeredAction.action({
        input: { ...input, format: 'standard' },
      });
      const nohyphensResult = await registeredAction.action({
        input: { ...input, format: 'nohyphens' },
      });

      const standardUuid = standardResult.output.uuids[0];
      const nohyphensUuid = nohyphensResult.output.uuids[0];

      // Remove hyphens from standard format should match nohyphens format structure
      expect(standardUuid.replace(/-/g, '')).toHaveLength(32);
      expect(nohyphensUuid).toHaveLength(32);
    });
  });
});
