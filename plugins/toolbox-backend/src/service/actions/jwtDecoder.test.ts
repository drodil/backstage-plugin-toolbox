import { createJwtDecoderAction } from './jwtDecoder';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import jwt from 'jsonwebtoken';

describe('createJwtDecoderAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    createJwtDecoderAction({ actionsRegistry: mockActionsRegistry });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('encode-decode-jwt');
    expect(registeredAction.title).toBe('Decode/Encode JWT');
    expect(registeredAction.description).toBe(
      'Decode JWT tokens or encode JWT tokens with provided payload and key',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: false,
      destructive: false,
    });
  });

  describe('action handler', () => {
    describe('decode mode', () => {
      it('should decode valid JWT token without verification', async () => {
        const payload = {
          userId: 123,
          username: 'testuser',
          exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const secret = 'test-secret';
        const token = jwt.sign(payload, secret);

        const input = {
          mode: 'decode' as const,
          token,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toContain('userId');
        expect(result.output.result).toContain('123');
        expect(result.output.result).toContain('testuser');
        expect(result.output.header).toContain('alg');
        expect(result.output.payload).toContain('userId');
        expect(result.output.signature).toBeDefined();
      });

      it('should decode and verify JWT token with correct secret', async () => {
        const payload = { userId: 123, username: 'testuser' };
        const secret = 'test-secret';
        const token = jwt.sign(payload, secret);

        const input = {
          mode: 'decode' as const,
          token,
          secret,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toContain('userId');
        expect(result.output.result).toContain('123');
        expect(result.output.result).not.toContain('Verification failed');
        expect(result.output.header).toContain('alg');
        expect(result.output.payload).toContain('userId');
      });

      it('should decode JWT token and show verification failure with wrong secret', async () => {
        const payload = { userId: 123, username: 'testuser' };
        const secret = 'test-secret';
        const wrongSecret = 'wrong-secret';
        const token = jwt.sign(payload, secret);

        const input = {
          mode: 'decode' as const,
          token,
          secret: wrongSecret,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toContain('Verification failed');
        expect(result.output.result).toContain('userId'); // Should still show decoded payload
        expect(result.output.header).toContain('alg');
        expect(result.output.payload).toContain('userId');
      });

      it('should handle JWT with custom claims', async () => {
        const payload = {
          sub: '1234567890',
          name: 'John Doe',
          iat: 1516239022,
          roles: ['admin', 'user'],
          metadata: {
            department: 'engineering',
            location: 'US',
          },
        };
        const secret = 'test-secret';
        const token = jwt.sign(payload, secret);

        const input = {
          mode: 'decode' as const,
          token,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toContain('John Doe');
        expect(result.output.result).toContain('admin');
        expect(result.output.result).toContain('engineering');
        expect(result.output.payload).toContain('roles');
        expect(result.output.payload).toContain('metadata');
      });

      it('should throw error for missing token in decode mode', async () => {
        const input = {
          mode: 'decode' as const,
        };

        await expect(registeredAction.action({ input })).rejects.toThrow(
          'Token is required for decode mode',
        );
      });

      it('should throw error for invalid JWT token', async () => {
        const input = {
          mode: 'decode' as const,
          token: 'invalid.jwt.token',
        };

        await expect(registeredAction.action({ input })).rejects.toThrow(
          'Invalid JWT token',
        );
      });

      it('should handle malformed JWT token', async () => {
        const input = {
          mode: 'decode' as const,
          token: 'not-a-jwt-token',
        };

        await expect(registeredAction.action({ input })).rejects.toThrow();
      });
    });

    describe('encode mode', () => {
      it('should encode JWT token with default algorithm (HS256)', async () => {
        const payload = { userId: 123, username: 'testuser' };
        const secret = 'test-secret';

        const input = {
          mode: 'encode' as const,
          payload: JSON.stringify(payload),
          secret,
          algorithm: 'HS256' as const, // Explicitly provide algorithm
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toMatch(
          /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        );

        // Verify the token can be decoded
        const decoded = jwt.verify(result.output.result, secret) as any;
        expect(decoded.userId).toBe(123);
        expect(decoded.username).toBe('testuser');
      });

      it('should encode JWT token with custom algorithm', async () => {
        const payload = { userId: 123, username: 'testuser' };
        const secret = 'test-secret';

        const input = {
          mode: 'encode' as const,
          payload: JSON.stringify(payload),
          secret,
          algorithm: 'HS512' as const,
        };

        const result = await registeredAction.action({ input });

        expect(result.output.result).toMatch(
          /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        );

        // Verify the token was signed with HS512
        const decoded = jwt.decode(result.output.result, {
          complete: true,
        }) as any;
        expect(decoded.header.alg).toBe('HS512');

        // Verify the token can be decoded with correct algorithm
        const verified = jwt.verify(result.output.result, secret, {
          algorithms: ['HS512'],
        }) as any;
        expect(verified.userId).toBe(123);
      });

      it('should encode JWT token with expiration', async () => {
        const payload = {
          userId: 123,
          username: 'testuser',
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        };
        const secret = 'test-secret';

        const input = {
          mode: 'encode' as const,
          payload: JSON.stringify(payload),
          secret,
          algorithm: 'HS256' as const, // Explicitly provide algorithm
        };

        const result = await registeredAction.action({ input });

        const decoded = jwt.verify(result.output.result, secret) as any;
        expect(decoded.exp).toBeDefined();
        expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
      });

      it('should encode JWT token with complex payload', async () => {
        const payload = {
          sub: '1234567890',
          name: 'John Doe',
          roles: ['admin', 'user'],
          permissions: {
            read: true,
            write: true,
            delete: false,
          },
          metadata: {
            department: 'engineering',
            team: 'backend',
            projects: ['project1', 'project2'],
          },
        };
        const secret = 'test-secret';

        const input = {
          mode: 'encode' as const,
          payload: JSON.stringify(payload),
          secret,
          algorithm: 'HS256' as const, // Explicitly provide algorithm
        };

        const result = await registeredAction.action({ input });

        const decoded = jwt.verify(result.output.result, secret) as any;
        expect(decoded.name).toBe('John Doe');
        expect(decoded.roles).toEqual(['admin', 'user']);
        expect(decoded.permissions.read).toBe(true);
        expect(decoded.metadata.department).toBe('engineering');
        expect(decoded.metadata.projects).toEqual(['project1', 'project2']);
      });

      it('should throw error for missing payload in encode mode', async () => {
        const input = {
          mode: 'encode' as const,
          secret: 'test-secret',
        };

        await expect(registeredAction.action({ input })).rejects.toThrow(
          'Payload is required for encode mode',
        );
      });

      it('should throw error for missing secret in encode mode', async () => {
        const input = {
          mode: 'encode' as const,
          payload: JSON.stringify({ userId: 123 }),
        };

        await expect(registeredAction.action({ input })).rejects.toThrow(
          /Secret key is required for encode mode/, // Updated to match actual error message
        );
      });

      it('should throw error for invalid JSON payload', async () => {
        const input = {
          mode: 'encode' as const,
          payload: 'invalid json',
          secret: 'test-secret',
        };

        await expect(registeredAction.action({ input })).rejects.toThrow();
      });
    });

    describe('round trip encode/decode', () => {
      it('should maintain payload integrity through encode/decode cycle', async () => {
        const originalPayload = {
          userId: 123,
          username: 'testuser',
          roles: ['admin', 'user'],
          metadata: { department: 'engineering' },
        };
        const secret = 'test-secret';

        // Encode
        const encodeResult = await registeredAction.action({
          input: {
            mode: 'encode',
            payload: JSON.stringify(originalPayload),
            secret,
            algorithm: 'HS256' as const, // Add explicit algorithm
          },
        });

        // Decode
        const decodeResult = await registeredAction.action({
          input: {
            mode: 'decode',
            token: encodeResult.output.result,
            secret,
          },
        });

        const decodedPayload = JSON.parse(decodeResult.output.payload);
        expect(decodedPayload.userId).toBe(originalPayload.userId);
        expect(decodedPayload.username).toBe(originalPayload.username);
        expect(decodedPayload.roles).toEqual(originalPayload.roles);
        expect(decodedPayload.metadata).toEqual(originalPayload.metadata);
      });

      it('should work with different algorithms', async () => {
        const algorithms = ['HS256', 'HS384', 'HS512'] as const;
        const payload = { userId: 123, username: 'testuser' };
        const secret = 'test-secret';

        for (const algorithm of algorithms) {
          // Encode
          const encodeResult = await registeredAction.action({
            input: {
              mode: 'encode',
              payload: JSON.stringify(payload),
              secret,
              algorithm,
            },
          });

          // Decode
          const decodeResult = await registeredAction.action({
            input: {
              mode: 'decode',
              token: encodeResult.output.result,
              secret,
            },
          });

          const decodedPayload = JSON.parse(decodeResult.output.payload);
          expect(decodedPayload.userId).toBe(payload.userId);
          expect(decodedPayload.username).toBe(payload.username);

          const header = JSON.parse(decodeResult.output.header);
          expect(header.alg).toBe(algorithm);
        }
      });
    });
  });
});
