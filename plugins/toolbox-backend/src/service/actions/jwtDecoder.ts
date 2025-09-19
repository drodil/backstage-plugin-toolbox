import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import jwt from 'jsonwebtoken';

export const createJwtDecoderAction = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  const { actionsRegistry } = options;
  actionsRegistry.register({
    name: 'encode-decode-jwt',
    title: 'Decode/Encode JWT',
    description:
      'Decode JWT tokens or encode JWT tokens with provided payload and key',
    attributes: {
      readOnly: true,
      idempotent: false,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          mode: z.enum(['decode', 'encode']).describe('Operation mode'),
          token: z
            .string()
            .optional()
            .describe('JWT token to decode (for decode mode)'),
          payload: z
            .string()
            .optional()
            .describe('JSON payload for encoding (for encode mode)'),
          secret: z
            .string()
            .optional()
            .describe('Secret key for encoding/verification'),
          algorithm: z
            .enum(['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'])
            .optional()
            .default('HS256')
            .describe('Algorithm for encoding'),
        }),
      output: z =>
        z.object({
          result: z
            .string()
            .describe('Decoded JWT payload or encoded JWT token'),
          header: z
            .string()
            .optional()
            .describe('JWT header (for decode mode)'),
          payload: z
            .string()
            .optional()
            .describe('JWT payload (for decode mode)'),
          signature: z
            .string()
            .optional()
            .describe('JWT signature (for decode mode)'),
        }),
    },
    action: async ({ input }) => {
      const { mode, token, payload, secret, algorithm } = input;

      try {
        if (mode === 'decode') {
          if (!token) {
            throw new Error('Token is required for decode mode');
          }

          // Decode without verification first to get header and payload
          const decoded = jwt.decode(token, { complete: true });
          if (!decoded) {
            throw new Error('Invalid JWT token');
          }

          const header = JSON.stringify(decoded.header, null, 2);
          const decodedPayload = JSON.stringify(decoded.payload, null, 2);
          const signature = decoded.signature;

          // If secret is provided, verify the token
          let result = decodedPayload;
          if (secret) {
            try {
              const verified = jwt.verify(token, secret);
              result = JSON.stringify(verified, null, 2);
            } catch (verifyError) {
              result = `${decodedPayload}\n\nVerification failed: ${verifyError.message}`;
            }
          }

          return {
            output: {
              result,
              header,
              payload: decodedPayload,
              signature,
            },
          };
        }

        // Encode mode
        if (!payload) {
          throw new Error('Payload is required for encode mode');
        }
        if (!secret) {
          throw new Error('Secret key is required for encode mode');
        }

        let parsedPayload;
        try {
          parsedPayload = JSON.parse(payload);
        } catch (parseError) {
          throw new Error(`Invalid JSON payload: ${parseError.message}`);
        }

        const encodedToken = jwt.sign(parsedPayload, secret, { algorithm });

        return {
          output: {
            result: encodedToken,
          },
        };
      } catch (error) {
        throw new Error(`Failed to ${mode} JWT: ${error.message}`);
      }
    },
  });
};
