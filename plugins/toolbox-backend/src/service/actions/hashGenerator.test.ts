import { createHashGeneratorAction } from './hashGenerator';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createHashGeneratorAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createHashGeneratorAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('generate-hash');
    expect(registeredAction.title).toBe('Generate Hash');
    expect(registeredAction.description).toBe(
      'Generate various hash algorithms for input text',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should generate all hash types for simple text', async () => {
      const input = { text: 'Hello, World!' };

      const result = await registeredAction.action({ input });

      expect(result.output.md5).toBe('65a8e27d8879283831b664bd8b7f0ad4');
      expect(result.output.sha1).toBe(
        '0a0a9f2a6772942557ab5355d76af442f8f65e01',
      );
      expect(result.output.sha256).toBe(
        'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f',
      );
      expect(result.output.sha384).toBe(
        '5485cc9b3365b4305dfb4e8337e0a598a574f8242bf17289e0dd6c20a3cd44a089de16ab4ab308f63e44b1170eb5f515',
      );
      expect(result.output.sha512).toBe(
        '374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387',
      );
    });

    it('should generate hashes for empty string', async () => {
      const input = { text: '' };

      const result = await registeredAction.action({ input });

      expect(result.output.md5).toBe('d41d8cd98f00b204e9800998ecf8427e');
      expect(result.output.sha1).toBe(
        'da39a3ee5e6b4b0d3255bfef95601890afd80709',
      );
      expect(result.output.sha256).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      );
      expect(result.output.sha384).toBe(
        '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
      );
      expect(result.output.sha512).toBe(
        'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
      );
    });

    it('should generate consistent hashes for same input', async () => {
      const input = { text: 'consistent test' };

      const result1 = await registeredAction.action({ input });
      const result2 = await registeredAction.action({ input });

      expect(result1.output.md5).toBe(result2.output.md5);
      expect(result1.output.sha1).toBe(result2.output.sha1);
      expect(result1.output.sha256).toBe(result2.output.sha256);
      expect(result1.output.sha384).toBe(result2.output.sha384);
      expect(result1.output.sha512).toBe(result2.output.sha512);
    });

    it('should generate different hashes for different inputs', async () => {
      const input1 = { text: 'test1' };
      const input2 = { text: 'test2' };

      const result1 = await registeredAction.action({ input: input1 });
      const result2 = await registeredAction.action({ input: input2 });

      expect(result1.output.md5).not.toBe(result2.output.md5);
      expect(result1.output.sha1).not.toBe(result2.output.sha1);
      expect(result1.output.sha256).not.toBe(result2.output.sha256);
      expect(result1.output.sha384).not.toBe(result2.output.sha384);
      expect(result1.output.sha512).not.toBe(result2.output.sha512);
    });

    it('should handle special characters', async () => {
      const input = { text: '!@#$%^&*()_+-=[]{}|;:,.<>?' };

      const result = await registeredAction.action({ input });

      expect(result.output.md5).toMatch(/^[a-f0-9]{32}$/);
      expect(result.output.sha1).toMatch(/^[a-f0-9]{40}$/);
      expect(result.output.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(result.output.sha384).toMatch(/^[a-f0-9]{96}$/);
      expect(result.output.sha512).toMatch(/^[a-f0-9]{128}$/);
    });

    it('should handle unicode characters', async () => {
      const input = { text: '🎉😀👍 Здравствуй мир 世界' };

      const result = await registeredAction.action({ input });

      expect(result.output.md5).toMatch(/^[a-f0-9]{32}$/);
      expect(result.output.sha1).toMatch(/^[a-f0-9]{40}$/);
      expect(result.output.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(result.output.sha384).toMatch(/^[a-f0-9]{96}$/);
      expect(result.output.sha512).toMatch(/^[a-f0-9]{128}$/);
    });

    it('should handle long text input', async () => {
      const longText = 'a'.repeat(10000);
      const input = { text: longText };

      const result = await registeredAction.action({ input });

      expect(result.output.md5).toMatch(/^[a-f0-9]{32}$/);
      expect(result.output.sha1).toMatch(/^[a-f0-9]{40}$/);
      expect(result.output.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(result.output.sha384).toMatch(/^[a-f0-9]{96}$/);
      expect(result.output.sha512).toMatch(/^[a-f0-9]{128}$/);
    });

    it('should handle newlines and whitespace', async () => {
      const input = { text: 'Line 1\nLine 2\r\nLine 3\t\tTabbed' };

      const result = await registeredAction.action({ input });

      expect(result.output.md5).toMatch(/^[a-f0-9]{32}$/);
      expect(result.output.sha1).toMatch(/^[a-f0-9]{40}$/);
      expect(result.output.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(result.output.sha384).toMatch(/^[a-f0-9]{96}$/);
      expect(result.output.sha512).toMatch(/^[a-f0-9]{128}$/);
    });

    it('should return all hash types in output', async () => {
      const input = { text: 'test' };

      const result = await registeredAction.action({ input });

      expect(result.output).toHaveProperty('md5');
      expect(result.output).toHaveProperty('sha1');
      expect(result.output).toHaveProperty('sha256');
      expect(result.output).toHaveProperty('sha384');
      expect(result.output).toHaveProperty('sha512');
      expect(Object.keys(result.output)).toHaveLength(5);
    });
  });
});
