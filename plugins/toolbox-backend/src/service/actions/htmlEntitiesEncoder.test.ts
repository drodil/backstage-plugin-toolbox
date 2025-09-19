import { createHtmlEntitiesEncoderAction } from './htmlEntitiesEncoder';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

describe('createHtmlEntitiesEncoderAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createHtmlEntitiesEncoderAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('encode-decode-html-entities');
    expect(registeredAction.title).toBe('Encode/Decode HTML Entities');
    expect(registeredAction.description).toBe(
      'Encode or decode HTML entities in text',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    describe('encode mode', () => {
      it('should encode basic HTML entities', async () => {
        const input = {
          data: 'Hello & welcome to <div>my "website"</div>',
          mode: 'encode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe(
          'Hello &amp; welcome to &lt;div&gt;my &quot;website&quot;&lt;&#x2F;div&gt;',
        );
      });

      it('should encode ampersands', async () => {
        const input = {
          data: 'Tom & Jerry & Friends',
          mode: 'encode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe('Tom &amp; Jerry &amp; Friends');
      });

      it('should encode angle brackets', async () => {
        const input = {
          data: '<script>alert("XSS")</script>',
          mode: 'encode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe(
          '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;',
        );
      });

      it('should encode quotes', async () => {
        const input = {
          data: 'He said "Hello" and she said \'Hi\'',
          mode: 'encode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe(
          'He said &quot;Hello&quot; and she said &#39;Hi&#39;',
        );
      });

      it('should handle empty string', async () => {
        const input = {
          data: '',
          mode: 'encode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe('');
      });

      it('should handle text without HTML entities', async () => {
        const input = {
          data: 'Normal text without special characters',
          mode: 'encode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe(
          'Normal text without special characters',
        );
      });
    });

    describe('decode mode', () => {
      it('should decode basic HTML entities', async () => {
        const input = {
          data: 'Hello &amp; welcome to &lt;div&gt;my &quot;website&quot;&lt;&#x2F;div&gt;',
          mode: 'decode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe(
          'Hello & welcome to <div>my "website"</div>',
        );
      });

      it('should decode ampersands', async () => {
        const input = {
          data: 'Tom &amp; Jerry &amp; Friends',
          mode: 'decode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe('Tom & Jerry & Friends');
      });

      it('should decode angle brackets', async () => {
        const input = {
          data: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;',
          mode: 'decode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe('<script>alert("XSS")</script>');
      });

      it('should decode quotes', async () => {
        const input = {
          data: 'He said &quot;Hello&quot; and she said &#39;Hi&#39;',
          mode: 'decode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe(
          'He said "Hello" and she said \'Hi\'',
        );
      });

      it('should handle empty string', async () => {
        const input = {
          data: '',
          mode: 'decode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe('');
      });

      it('should handle text without HTML entities', async () => {
        const input = {
          data: 'Normal text without entities',
          mode: 'decode' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toBe('Normal text without entities');
      });
    });

    describe('round trip encode/decode', () => {
      it('should maintain data integrity through encode/decode cycle', async () => {
        const originalData =
          'Hello & welcome to <div>my "website" with \'quotes\'</div>';

        // Encode
        const encodeResult = await registeredAction.action({
          input: { data: originalData, mode: 'encode' },
        });

        // Decode
        const decodeResult = await registeredAction.action({
          input: { data: encodeResult.output.result, mode: 'decode' },
        });

        expect(decodeResult.output.result).toBe(originalData);
      });

      it('should handle complex HTML content', async () => {
        const originalData =
          '<p class="test">Content with & symbols, "quotes", and \'apostrophes\'</p>';

        // Encode
        const encodeResult = await registeredAction.action({
          input: { data: originalData, mode: 'encode' },
        });

        // Decode
        const decodeResult = await registeredAction.action({
          input: { data: encodeResult.output.result, mode: 'decode' },
        });

        expect(decodeResult.output.result).toBe(originalData);
      });
    });
  });
});
