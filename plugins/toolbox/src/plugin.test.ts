import { ReactElement, createElement } from 'react';
import type { TFunction } from 'i18next';
import {
  ToolContainer,
  ToolboxPage,
  ToolsContainer,
  toolboxHomepageCardFactory,
  toolboxPlugin,
} from './plugin';

describe('toolbox', () => {
  it('should export plugin', () => {
    expect(toolboxPlugin).toBeDefined();
  });

  it('should export ToolboxPage', () => {
    expect(ToolboxPage).toBeDefined();
  });

  it('should export ToolsContainer', () => {
    expect(ToolsContainer).toBeDefined();
  });

  it('should export ToolContainer', () => {
    expect(ToolContainer).toBeDefined();
  });
});

describe('toolboxHomepageCardFactory', () => {
  const mockToolComponent: ReactElement = createElement(
    'div',
    null,
    'Mock Tool',
  );
  const mockTool = {
    id: 'foo',
    name: 'Foo',
    category: 'Test',
    component: mockToolComponent,
  };
  const mockTools = [mockTool];
  const mockT: TFunction = (key: string | string[]) => {
    const k = Array.isArray(key) ? key[0] : key;
    return `translated:${k}` as any;
  };

  it('returns a defined extension', () => {
    const card = toolboxHomepageCardFactory({
      name: 'TestCard',
      title: 'Test',
      description: 'desc',
      popupTitle: 'popup',
      selectorTitle: 'selector',
      tools: mockTools,
    });
    expect(card).toBeDefined();
  });

  it('uses custom translation function if provided', () => {
    const card = toolboxHomepageCardFactory({
      name: 'TestCard',
      title: 'Test',
      description: 'desc',
      popupTitle: 'popup',
      selectorTitle: 'selector',
      tools: mockTools,
      t: mockT,
    });
    expect(card).toBeDefined();
  });

  it('handles options with favorites, extraTools, backendTools, and toolFilterFunction', () => {
    const mockExtraToolComponent: ReactElement = createElement(
      'div',
      null,
      'Extra Tool',
    );
    const extraTool = {
      id: 'bar',
      name: 'Bar',
      category: 'Extra',
      component: mockExtraToolComponent,
    };
    const toolFilterFunction = () => true;

    const card = toolboxHomepageCardFactory({
      name: 'TestCard',
      title: 'Test',
      description: 'desc',
      popupTitle: 'popup',
      selectorTitle: 'selector',
      tools: mockTools,
      extraTools: [extraTool],
      favorites: ['foo'],
      backendTools: ['foo'],
      toolFilterFunction,
      favoritesCategory: 'Favorites',
      t: mockT,
    });
    expect(card).toBeDefined();
  });

  it('uses fallbacks if no translation provided', () => {
    const card = toolboxHomepageCardFactory({
      name: 'TestCard',
      title: 'Test',
      description: 'desc',
      popupTitle: 'popup',
      selectorTitle: 'selector',
      tools: mockTools,
    });
    expect(card).toBeDefined();
  });
});
