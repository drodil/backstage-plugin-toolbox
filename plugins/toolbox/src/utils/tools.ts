import { TFunction } from 'i18next';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { defaultTools } from '../components/Root/tools';

export interface GetSortedToolsProps {
  extraTools?: Tool[];
  tools?: Tool[];
  favorites?: string[];
  backendTools?: string[];
  toolFilterFunction?: (tool: Tool) => boolean;
  favoritesCategory: string;
  t?: TFunction;
}

export function getSortedTools({
  extraTools,
  tools,
  favorites = [],
  backendTools = [],
  toolFilterFunction,
  favoritesCategory,
  t,
}: GetSortedToolsProps): Tool[] {
  const shownTools = tools ?? [...(extraTools ?? []), ...defaultTools];
  return shownTools
    .filter(
      tool =>
        (tool.requiresBackend === true && backendTools.includes(tool.id)) ||
        tool.requiresBackend !== true,
    )
    .filter(tool => toolFilterFunction?.(tool) ?? true)
    .map(tool => {
      if (favorites.includes(tool.id)) {
        return { ...tool, category: favoritesCategory };
      }
      return tool;
    })
    .sort((a, b) => {
      const aCategory = a.category ?? 'Miscellaneous';
      const bCategory = b.category ?? 'Miscellaneous';

      const aCategoryStr = t
        ? t(`tool.category.${aCategory.toLowerCase()}`, {
            defaultValue: aCategory,
          })
        : aCategory;
      const bCategoryStr = t
        ? t(`tool.category.${bCategory.toLowerCase()}`, {
            defaultValue: bCategory,
          })
        : bCategory;

      if (aCategoryStr === favoritesCategory) return -1;
      if (bCategoryStr === favoritesCategory) return 1;
      const categoryCompare = aCategoryStr
        .toLowerCase()
        .localeCompare(bCategoryStr.toLowerCase());
      if (categoryCompare !== 0) return categoryCompare;
      const aName = (a.displayName || a.name || a.id).toLowerCase();
      const bName = (b.displayName || b.name || b.id).toLowerCase();
      return aName.localeCompare(bName);
    });
}

export function getToolTitle(tool: Tool, t?: TFunction): string {
  const name = tool.displayName || tool.name;
  if (!name) return 'Name Not Defined';
  const category = tool.category || 'Miscellaneous';
  if (!t) return `${category} - ${name}`;
  const categoryKey = `tool.category.${category.toLowerCase()}`;
  const tName = t(`tool.${tool.id}.name`, { defaultValue: name });
  const tCategory = t(categoryKey, { defaultValue: category });
  return `${tCategory} - ${tName}`;
}
