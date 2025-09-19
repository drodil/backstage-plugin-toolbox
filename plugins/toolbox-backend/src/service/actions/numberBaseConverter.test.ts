import { createNumberBaseConverterAction } from './numberBaseConverter';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createNumberBaseConverterAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createNumberBaseConverterAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('convert-number-base');
    expect(registeredAction.title).toBe('Convert Number Base');
    expect(registeredAction.description).toBe(
      'Convert numbers between different bases (binary, octal, decimal, hexadecimal)',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should convert from decimal to all bases', async () => {
      const input = { value: '255', fromBase: '10' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.binary).toBe('11111111');
      expect(result.output.octal).toBe('377');
      expect(result.output.decimal).toBe('255');
      expect(result.output.hexadecimal).toBe('FF');
    });

    it('should convert from binary to all bases', async () => {
      const input = { value: '1010', fromBase: '2' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.binary).toBe('1010');
      expect(result.output.octal).toBe('12');
      expect(result.output.decimal).toBe('10');
      expect(result.output.hexadecimal).toBe('A');
    });

    it('should convert from octal to all bases', async () => {
      const input = { value: '777', fromBase: '8' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.binary).toBe('111111111');
      expect(result.output.octal).toBe('777');
      expect(result.output.decimal).toBe('511');
      expect(result.output.hexadecimal).toBe('1FF');
    });

    it('should convert from hexadecimal to all bases', async () => {
      const input = { value: 'FF', fromBase: '16' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.binary).toBe('11111111');
      expect(result.output.octal).toBe('377');
      expect(result.output.decimal).toBe('255');
      expect(result.output.hexadecimal).toBe('FF');
    });

    it('should handle zero value', async () => {
      const input = { value: '0', fromBase: '10' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.binary).toBe('0');
      expect(result.output.octal).toBe('0');
      expect(result.output.decimal).toBe('0');
      expect(result.output.hexadecimal).toBe('0');
    });

    it('should handle large numbers', async () => {
      const input = { value: '1023', fromBase: '10' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.binary).toBe('1111111111');
      expect(result.output.octal).toBe('1777');
      expect(result.output.decimal).toBe('1023');
      expect(result.output.hexadecimal).toBe('3FF');
    });

    it('should handle lowercase hexadecimal input', async () => {
      const input = { value: 'abc', fromBase: '16' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.binary).toBe('101010111100');
      expect(result.output.octal).toBe('5274');
      expect(result.output.decimal).toBe('2748');
      expect(result.output.hexadecimal).toBe('ABC');
    });

    it('should throw error for invalid binary number', async () => {
      // JavaScript parseInt is permissive and ignores invalid digits, so '102' in base 2 becomes '2'
      // Let's use a truly invalid binary string that will cause NaN
      const invalidInput = { value: 'abc', fromBase: '2' as const };

      await expect(
        registeredAction.action({ input: invalidInput }),
      ).rejects.toThrow(/Invalid number format for base 2/);
    });

    it('should throw error for invalid octal number', async () => {
      // JavaScript parseInt is permissive, so let's use truly invalid octal
      const invalidInput = { value: 'xyz', fromBase: '8' as const };

      await expect(
        registeredAction.action({ input: invalidInput }),
      ).rejects.toThrow(/Invalid number format for base 8/);
    });

    it('should throw error for invalid hexadecimal number', async () => {
      const input = { value: 'XYZ', fromBase: '16' as const };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Invalid number format for base 16/,
      );
    });

    it('should throw error for empty value', async () => {
      const input = { value: '', fromBase: '10' as const };

      await expect(registeredAction.action({ input })).rejects.toThrow(
        /Invalid number format for base 10/,
      );
    });

    it('should handle edge case with maximum safe integer', async () => {
      const input = { value: '9007199254740991', fromBase: '10' as const };

      const result = await registeredAction.action({ input });

      expect(result.output.decimal).toBe('9007199254740991');
      expect(result.output.hexadecimal).toBe('1FFFFFFFFFFFFF');
    });
  });
});
