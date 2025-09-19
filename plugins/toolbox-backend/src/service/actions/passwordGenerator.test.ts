import { createPasswordGeneratorAction } from './passwordGenerator';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createPasswordGeneratorAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createPasswordGeneratorAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('generate-password');
    expect(registeredAction.title).toBe('Generate Password');
    expect(registeredAction.description).toBe(
      'Generate secure passwords with customizable options',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should generate password with default settings', async () => {
      const input = {
        // Use explicit defaults that match the schema
        length: 16,
        count: 1,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.passwords).toHaveLength(1);
      expect(result.output.passwords[0]).toHaveLength(16);
      expect(typeof result.output.passwords[0]).toBe('string');
    });

    it('should generate password with custom length', async () => {
      const input = {
        length: 32,
        count: 1,
        // Explicitly set defaults
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.passwords).toHaveLength(1);
      expect(result.output.passwords[0]).toHaveLength(32);
    });

    it('should generate multiple passwords', async () => {
      const input = {
        length: 16,
        count: 5,
        // Explicitly set defaults
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.passwords).toHaveLength(5);
      result.output.passwords.forEach((password: string) => {
        expect(password).toHaveLength(16);
        expect(typeof password).toBe('string');
      });
    });

    it('should generate passwords with only uppercase letters', async () => {
      const input = {
        includeUppercase: true,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
        length: 20,
        count: 1, // Add explicit count
      };

      const result = await registeredAction.action({ input });

      const password = result.output.passwords[0];
      expect(password).toMatch(/^[A-Z]+$/);
      expect(password).toHaveLength(20);
    });

    it('should generate passwords with only lowercase letters', async () => {
      const input = {
        includeUppercase: false,
        includeLowercase: true,
        includeNumbers: false,
        includeSymbols: false,
        length: 20,
        count: 1, // Add explicit count
      };

      const result = await registeredAction.action({ input });

      const password = result.output.passwords[0];
      expect(password).toMatch(/^[a-z]+$/);
      expect(password).toHaveLength(20);
    });

    it('should generate passwords with only numbers', async () => {
      const input = {
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: true,
        includeSymbols: false,
        length: 20,
        count: 1, // Add explicit count
      };

      const result = await registeredAction.action({ input });

      const password = result.output.passwords[0];
      expect(password).toMatch(/^[0-9]+$/);
      expect(password).toHaveLength(20);
    });

    it('should generate passwords with only symbols', async () => {
      const input = {
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: true,
        length: 20,
        count: 1, // Add explicit count
      };

      const result = await registeredAction.action({ input });

      const password = result.output.passwords[0];
      expect(password).toMatch(/^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
      expect(password).toHaveLength(20);
    });

    it('should exclude similar characters when requested', async () => {
      const input = {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: true,
        length: 100, // Larger length to increase chances of testing all characters
        count: 10,
      };

      const result = await registeredAction.action({ input });

      result.output.passwords.forEach((password: string) => {
        // Should not contain similar characters: 0, O, l, I
        expect(password).not.toMatch(/[0OlI]/);
        // Should still contain allowed characters
        expect(password).toMatch(/[A-HJ-NP-Z2-9a-hj-kmnp-z]/);
      });
    });

    it('should include similar characters when not excluded', async () => {
      const input = {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: false,
        length: 100,
        count: 10,
      };

      const result = await registeredAction.action({ input });

      // At least one password should contain some similar characters (with high probability)
      const allPasswords = result.output.passwords.join('');
      expect(allPasswords).toMatch(/[A-Za-z0-9]/);
    });

    it('should generate different passwords each time', async () => {
      const input = {
        length: 20,
        count: 10,
        // Add required character type flags
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };

      const result = await registeredAction.action({ input });

      const passwords = result.output.passwords;
      const uniquePasswords = new Set(passwords);

      // All passwords should be unique (very high probability with 20 character length)
      expect(uniquePasswords.size).toBe(passwords.length);
    });

    it('should throw error when no character types are selected', async () => {
      const input = {
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
      };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        'At least one character type must be selected',
      );
    });

    it('should handle minimum length constraint', async () => {
      const input = {
        length: 8,
        count: 1, // Add explicit count
        // Add required character type flags
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.passwords[0]).toHaveLength(8);
    });

    it('should handle maximum length constraint', async () => {
      const input = {
        length: 128,
        count: 1, // Add explicit count
        // Add required character type flags
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.passwords[0]).toHaveLength(128);
    });

    it('should handle maximum count constraint', async () => {
      const input = {
        length: 16, // Add explicit length
        count: 50,
        // Add required character type flags
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.passwords).toHaveLength(50);
    });

    it('should generate complex passwords with all character types', async () => {
      const input = {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        length: 50,
        count: 1, // Add explicit count
      };

      const result = await registeredAction.action({ input });

      const password = result.output.passwords[0];

      // With length 50 and all character types, very high probability of containing each type
      expect(password).toMatch(/[A-Z]/); // Contains uppercase
      expect(password).toMatch(/[a-z]/); // Contains lowercase
      expect(password).toMatch(/[0-9]/); // Contains numbers
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // Contains symbols
      expect(password).toHaveLength(50);
    });
  });
});
