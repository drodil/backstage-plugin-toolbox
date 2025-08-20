import { createApiRef } from '@backstage/core-plugin-api';

export type ToolRequest = typeof globalThis extends { onmessage: any }
  ? {
      method?: string;
      headers?: Record<string, string>;
      body?:
        | string
        | ArrayBuffer
        | SharedArrayBuffer
        | ArrayBufferView
        | Blob
        | FormData
        | URLSearchParams
        | ReadableStream<Uint8Array>
        | null;
    }
  : import('undici-types').RequestInit;
export type ToolResponse = typeof globalThis extends { onmessage: any }
  ? {
      readonly status: number;
      readonly statusText: string;
      readonly ok: boolean;
      readonly json: () => Promise<unknown>;
      readonly text: () => Promise<string>;
      readonly arrayBuffer: () => Promise<ArrayBuffer>;
    }
  : import('undici-types').Response;

export interface ToolboxApi {
  getBackendTools(): Promise<string[]>;

  toolRequest(toolName: string, request: ToolRequest): Promise<ToolResponse>;

  toolJsonRequest(toolName: string, data: any): Promise<unknown>;
}

export const toolboxApiRef = createApiRef<ToolboxApi>({
  id: 'plugin.toolbox.service',
});
