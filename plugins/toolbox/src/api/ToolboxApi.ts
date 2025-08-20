import { createApiRef } from '@backstage/core-plugin-api';

export type ToolRequest = {
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
};

export type ToolResponse = {
  readonly status: number;
  readonly statusText: string;
  readonly ok: boolean;
  readonly json: () => Promise<unknown>;
  readonly text: () => Promise<string>;
  readonly arrayBuffer: () => Promise<ArrayBuffer>;
};

export interface ToolboxApi {
  getBackendTools(): Promise<string[]>;

  toolRequest(toolName: string, request: ToolRequest): Promise<ToolResponse>;

  toolJsonRequest(toolName: string, data: any): Promise<unknown>;
}

export const toolboxApiRef = createApiRef<ToolboxApi>({
  id: 'plugin.toolbox.service',
});
