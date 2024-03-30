import { ToolboxApi, ToolRequest, ToolResponse } from './ToolboxApi';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export class ToolboxClient implements ToolboxApi {
  private readonly fetchApi: FetchApi;
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { fetchApi: FetchApi; discoveryApi: DiscoveryApi }) {
    this.fetchApi = options.fetchApi;
    this.discoveryApi = options.discoveryApi;
  }

  async getBaseUrl(): Promise<string> {
    return this.discoveryApi.getBaseUrl('toolbox');
  }

  async getBackendTools(): Promise<string[]> {
    const url = `${await this.getBaseUrl()}/tools`;
    try {
      const response = await this.fetchApi.fetch(url);
      const data = await response.json();
      return data.tools;
    } catch (error) {
      return [];
    }
  }

  async toolRequest(
    toolName: string,
    request: ToolRequest,
  ): Promise<ToolResponse> {
    const url = `${await this.getBaseUrl()}/${toolName}`;
    try {
      const response = await this.fetchApi.fetch(url, request);
      if (response.ok) {
        return response;
      }
      throw new Error(`Request failed with status ${response.status}`);
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  async toolJsonRequest(toolName: string, data: any): Promise<unknown> {
    const request: ToolRequest = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await this.toolRequest(toolName, request);
    return response.json();
  }
}
