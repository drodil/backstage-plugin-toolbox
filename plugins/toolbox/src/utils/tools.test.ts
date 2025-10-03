import { getSortedTools, getToolTitle } from './tools';

import { TFunction } from 'i18next';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { defaultTools } from '../components/Root/tools';

const mockTools: Tool[] = [
  { id: 'a', name: 'Alpha', category: 'Convert', component: {} as any },
  { id: 'b', name: 'Beta', category: 'Encode', component: {} as any },
  { id: 'c', name: 'Gamma', category: 'Convert', component: {} as any },
];

const mockT: TFunction = (key: string | string[]) => {
  const k = Array.isArray(key) ? key[0] : key;
  return `translated:${k}` as any;
};

describe('getSortedTools', () => {
  it('returns all tools sorted by category when tools is provided', () => {
    const result = getSortedTools({
      tools: mockTools,
      favoritesCategory: 'Favorites',
    });
    expect(result.map(t => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('places favorites at the beginning and sets their category', () => {
    const result = getSortedTools({
      tools: mockTools,
      favorites: ['b'],
      favoritesCategory: 'Favorites',
    });
    expect(result[0].id).toBe('b');
    expect(result[0].category).toBe('Favorites');
  });

  it('filters tools using toolFilterFunction', () => {
    const result = getSortedTools({
      tools: mockTools,
      favoritesCategory: 'Favorites',
      toolFilterFunction: tool => tool.id !== 'b',
    });
    expect(result.map(t => t.id)).toEqual(['a', 'c']);
  });

  it('uses translation function for category sorting if provided', () => {
    const result = getSortedTools({
      tools: mockTools,
      favoritesCategory: 'Favorites',
      t: mockT,
    });
    expect(result[0].category).toBe('Convert');
    expect(result[1].category).toBe('Convert');
    expect(result[2].category).toBe('Encode');
  });

  it('returns an empty array when tools is empty', () => {
    const result = getSortedTools({
      tools: [],
      favoritesCategory: 'Favorites',
    });
    expect(result).toEqual([]);
  });
});

describe('getToolTitle', () => {
  const tool: Tool = {
    id: 'x',
    name: 'Xray',
    category: 'Convert',
    component: {} as any,
  };

  it('returns translated title if translation function is provided', () => {
    const title = getToolTitle(tool, mockT);
    expect(title).toBe(
      'translated:tool.category.convert - translated:tool.x.name',
    );
  });

  it('returns plain title if translation function is not provided', () => {
    const title = getToolTitle(tool);
    expect(title).toBe('Convert - Xray');
  });

  it('falls back to id and Miscellaneous if name/category are missing', () => {
    const tool2: Tool = { id: 'y', name: 'tool', component: {} as any };
    const title = getToolTitle(tool2);
    expect(title).toBe('Miscellaneous - tool');
  });
  it('returns "Name Not Defined" if both displayName and name are missing', () => {
    const newtool: Tool = {
      id: '',
      displayName: 'display name',
      name: '',
      component: {} as any,
    };
    const title = getToolTitle(newtool);
    expect(title).toBe('Miscellaneous - display name');
  });

  it('returns "Name Not Defined" if both displayName and name are empty strings', () => {
    const newtool: Tool = {
      id: 'empty',
      name: '',
      displayName: '',
      component: {} as any,
    };
    const title = getToolTitle(newtool);
    expect(title).toBe('Name Not Defined');
  });
});

describe('getSortedTools - shownTools and backend filtering', () => {
  const backendTool: Tool = {
    id: 'backend',
    name: 'Backend',
    category: 'Convert',
    requiresBackend: true,
    component: {} as any,
  };
  const regularTool: Tool = {
    id: 'regular',
    name: 'Regular',
    category: 'Encode',
    component: {} as any,
  };

  it('returns only tools when tools is provided, ignoring extraTools and defaultTools', () => {
    const result = getSortedTools({
      tools: [regularTool],
      extraTools: [backendTool],
      favoritesCategory: 'Favorites',
    });
    expect(result.map(t => t.id)).toEqual(['regular']);
  });

  it('returns extraTools combined with defaultTools when no tools', () => {
    const result = getSortedTools({
      extraTools: [regularTool],
      favoritesCategory: 'Favorites',
    });
    expect(result.some(t => t.id === 'regular')).toBe(true);
    expect(result.some(t => t.id === defaultTools[0].id)).toBe(true);
  });

  it('returns only defaultTools when no tools or extraTools', () => {
    const result = getSortedTools({
      favoritesCategory: 'Favorites',
    });
    const expectedIds = defaultTools
      .filter(tool => tool.requiresBackend !== true)
      .map(t => t.id);
    expect(new Set(result.map(t => t.id))).toEqual(new Set(expectedIds));
    expect(result).toHaveLength(expectedIds.length);
  });

  it('excludes tools with requiresBackend=true if not in backendTools', () => {
    const result = getSortedTools({
      tools: [backendTool, regularTool],
      backendTools: [],
      favoritesCategory: 'Favorites',
    });
    expect(result.map(t => t.id)).toEqual(['regular']);
  });

  it('includes tools with requiresBackend=true if their id is in backendTools', () => {
    const result = getSortedTools({
      tools: [backendTool, regularTool],
      backendTools: ['backend'],
      favoritesCategory: 'Favorites',
    });
    expect(result.map(t => t.id)).toEqual(['backend', 'regular']);
  });
});
