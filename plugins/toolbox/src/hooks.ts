import { ToolboxApi, toolboxApiRef } from './api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { useEffect, useState } from 'react';

export const useBackendTools = () => {
  const [tools, setTools] = useState<string[]>([]);
  const toolboxApi = useApi(toolboxApiRef);
  useEffect(() => {
    (async () => {
      setTools(await toolboxApi.getBackendTools());
    })();
  }, [toolboxApi]);
  return tools;
};

export function useToolboxApi<T>(
  f: (api: ToolboxApi) => Promise<T>,
  deps: any[] = [],
) {
  const toolboxApi = useApi(toolboxApiRef);

  return useAsync(async () => {
    return await f(toolboxApi);
  }, deps);
}
