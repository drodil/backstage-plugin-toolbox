import { createIbanValidatorAction } from './ibanValidator';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createIbanValidatorAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createIbanValidatorAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('validate-iban');
    expect(registeredAction.title).toBe('Validate IBAN');
    expect(registeredAction.description).toBe(
      'Validate International Bank Account Number (IBAN) codes',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should validate valid IBAN codes', async () => {
      const validIbans = [
        'DE89370400440532013000', // Germany
        'GB29NWBK60161331926819', // United Kingdom
        'FR1420041010050500013M02606', // France
        'ES9121000418450200051332', // Spain
      ];

      for (const iban of validIbans) {
        const result = await registeredAction.action({ input: { iban } });

        expect(result.output.isValid).toBe(true);
        expect(result.output.electronic).toBeDefined();
        expect(result.output.country).toBeDefined();
        expect(result.output.checkDigits).toBeDefined();
      }
    });

    it('should reject invalid IBAN codes', async () => {
      const invalidIbans = [
        'DE89370400440532013001', // Wrong check digits
        'GB29NWBK60161331926818', // Wrong check digits
        'INVALID123456789', // Invalid format
        'AB1234567890123456', // Invalid country code
        '', // Empty string
      ];

      for (const iban of invalidIbans) {
        const result = await registeredAction.action({ input: { iban } });
        expect(result.output.isValid).toBe(false);
      }
    });

    it('should handle IBAN with spaces', async () => {
      const input = { iban: 'DE89 3704 0044 0532 0130 00' };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.electronic).toBe('DE89370400440532013000');
    });

    it('should extract country code correctly', async () => {
      const testCases = [
        { iban: 'DE89370400440532013000', expectedCountry: 'DE' },
        { iban: 'GB29NWBK60161331926819', expectedCountry: 'GB' },
        { iban: 'FR1420041010050500013M02606', expectedCountry: 'FR' },
      ];

      for (const { iban, expectedCountry } of testCases) {
        const result = await registeredAction.action({ input: { iban } });
        expect(result.output.country).toBe(expectedCountry);
      }
    });

    it('should extract check digits correctly', async () => {
      const input = { iban: 'DE89370400440532013000' };

      const result = await registeredAction.action({ input });

      expect(result.output.checkDigits).toBe('89');
    });

    it('should extract BBAN correctly', async () => {
      const input = { iban: 'DE89370400440532013000' };

      const result = await registeredAction.action({ input });

      expect(result.output.bban).toBeDefined();
      expect(typeof result.output.bban).toBe('string');
      expect(result.output.bban?.length).toBeGreaterThan(0);
    });

    it('should handle lowercase IBAN', async () => {
      const input = { iban: 'de89370400440532013000' };

      const result = await registeredAction.action({ input });

      expect(result.output.isValid).toBe(true);
      expect(result.output.electronic).toBe('DE89370400440532013000');
    });
  });
});
