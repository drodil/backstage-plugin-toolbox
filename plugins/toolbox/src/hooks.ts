import { ToolboxApi, toolboxApiRef } from './api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { useCallback, useEffect, useState } from 'react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { toolboxTranslationRef } from './translation';

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

export const useToolboxTranslation = () => {
  const hookRef = useTranslationRef(toolboxTranslationRef);

  const i18n_UNSAFE = useCallback(
    (str: string, defaultValue?: string): string => {
      const intl = hookRef.t as (string: string) => string;
      const value = intl(str);
      if (value === str && defaultValue) {
        return defaultValue;
      }
      return value;
    },
    [hookRef],
  );
  return {
    ...hookRef,
    i18n_UNSAFE,
  };
};
