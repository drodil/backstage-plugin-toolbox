import { ReactElement, Suspense, useEffect, useMemo, useState } from 'react';
import { Content, ContentHeader } from '@backstage/core-components';
import { useFavoriteStorage } from '../../utils/hooks';
import {
  RiSearchLine,
  RiBriefcaseLine,
  RiExternalLinkLine,
} from '@remixicon/react';
import { getSortedTools } from '../../utils/tools';
import { FavoriteButton } from '../Buttons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalytics } from '@backstage/core-plugin-api';
import { WelcomePage } from '../WelcomePage/WelcomePage';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { TooltipTrigger, Tooltip, ButtonIcon } from '@backstage/ui';
import { useBackendTools, useToolboxTranslation } from '../../hooks';
import styles from './ToolsContainer.module.css';

export type ToolsContainerProps = {
  /** extra custom local tools to add into the tool page */
  extraTools?: Tool[];
  /** A list of which tools to have by default. Defaults to defaultTools.*/
  tools?: Tool[];
  /** Allows for custom sorting of the categories in the sidebar. Defaults to alphabetic sort with Favorites at top. */
  categorySortFunction?: (category1: string, caregory2: string) => number;
  /** Allows for custom sorting of the tools within a category. Defaults to alphabetic sort. */
  toolSortFunction?: (tool1: Tool, tool2: Tool) => number;
  /** Filter tools to be shown in runtime */
  toolFilterFunction?: (tool: Tool) => boolean;
  /** customize the landing page */
  welcomePage?: ReactElement;
};

export const ToolsContainer = (props: ToolsContainerProps) => {
  const {
    extraTools,
    tools,
    categorySortFunction,
    toolSortFunction,
    welcomePage,
    toolFilterFunction,
  } = props;
  const { hash } = useLocation();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const backendTools = useBackendTools();
  const favorites = useFavoriteStorage();

  const { t } = useToolboxTranslation();

  const openToolInWindow = (id: string) => {
    window.open(`/toolbox/tool/${id}`, 'newwindow', 'width=1000,height=800');
    return false;
  };

  const favoritesCategory = t('tool.category.favorites');
  const allTools = getSortedTools({
    extraTools,
    tools,
    favorites,
    backendTools,
    toolFilterFunction,
    favoritesCategory,
    t,
  });

  const matchesSearch = (tool: Tool) => {
    if (!search) return true;
    const toolName = t(`tool.${tool.id}.name`, {
      defaultValue: tool.displayName ?? tool.name,
    });
    const description = t(`tool.${tool.id}.description`, {
      defaultValue: tool.description,
    });
    return (
      toolName.toLowerCase().includes(search.toLowerCase()) ||
      tool.id.toLowerCase().includes(search.toLowerCase()) ||
      tool.aliases?.some(alias =>
        alias.toLowerCase().includes(search.toLowerCase()),
      ) ||
      description?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const categories: { [key: string]: Tool[] } = useMemo(
    () =>
      allTools.reduce((ctgs, tool) => {
        const categoryStr = t(
          `tool.category.${(tool.category ?? 'miscellaneous').toLowerCase()}`,
          { defaultValue: tool.category ?? 'Miscellaneous' },
        );
        const toolList: Tool[] = ctgs[categoryStr] || [];
        toolList.push(tool);
        ctgs[categoryStr] = toolList;
        return ctgs;
      }, {} as Record<string, Tool[]>),
    [allTools, t],
  );

  useEffect(() => {
    const id = hash.slice(1);
    if (id && id !== selectedId) {
      setSelectedId(id);
    }
  }, [hash, selectedId]);

  const handleToolClick = (id: string) => {
    analytics.captureEvent('click', id, { attributes: { toolName: id } });
    navigate(`#${id}`);
    setSelectedId(id);
  };

  const selectedTool = allTools.find(tool => tool.id === selectedId);
  const selectedTitle = selectedTool
    ? `${t(
        `tool.category.${(
          selectedTool.category ?? 'miscellaneous'
        ).toLowerCase()}`,
        { defaultValue: selectedTool.category ?? 'Miscellaneous' },
      )} - ${t(`tool.${selectedTool.id}.name`, {
        defaultValue: selectedTool.displayName ?? selectedTool.name,
      })}`
    : '';
  const selectedDescription = selectedTool
    ? t(`tool.${selectedTool.id}.description`, {
        defaultValue: selectedTool.description,
      })
    : '';

  return (
    <Content noPadding>
      <div className={styles.container}>
        <nav className={styles.sidebar}>
          <div className={styles.searchWrapper}>
            <input
              className={styles.searchInput}
              placeholder={t('toolsPage.input.search')}
              aria-label="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <RiSearchLine size={16} color="var(--bui-fg-secondary)" />
          </div>
          <ul className={styles.navList}>
            <li>
              <button
                className={`${styles.homeButton}${
                  selectedId === '' ? ` ${styles.toolButtonActive}` : ''
                }`}
                onClick={() => {
                  navigate('#');
                  setSelectedId('');
                }}
              >
                <RiBriefcaseLine size={16} />
                {t('toolsPage.tabPanel.mainLabel')}
              </button>
            </li>
            {Object.entries(categories)
              .sort(([a], [b]) => {
                if (categorySortFunction) return categorySortFunction(a, b);
                if (a === favoritesCategory) return -1;
                if (b === favoritesCategory) return 1;
                return a.localeCompare(b);
              })
              .map(([category, categoryTools]) => {
                const anyMatchSearch = categoryTools.some(tool =>
                  matchesSearch(tool),
                );
                return (
                  <li
                    key={category}
                    className={anyMatchSearch ? undefined : styles.hidden}
                  >
                    <span className={styles.categoryLabel}>{category}</span>
                    <ul className={styles.navList}>
                      {categoryTools
                        .sort((a, b) => {
                          if (toolSortFunction) return toolSortFunction(a, b);
                          return a.name.localeCompare(b.name);
                        })
                        .map(tool => (
                          <li
                            key={tool.id}
                            className={
                              matchesSearch(tool) ? undefined : styles.hidden
                            }
                          >
                            <button
                              className={`${styles.toolButton}${
                                selectedId === tool.id
                                  ? ` ${styles.toolButtonActive}`
                                  : ''
                              }`}
                              onClick={() => handleToolClick(tool.id)}
                              title={t(`tool.${tool.id}.name`, {
                                defaultValue: tool.displayName ?? tool.name,
                              })}
                            >
                              {t(`tool.${tool.id}.name`, {
                                defaultValue: tool.displayName ?? tool.name,
                              })}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </li>
                );
              })}
          </ul>
        </nav>
        <div className={styles.mainContent}>
          <Suspense
            fallback={
              <div className={styles.loadingContainer}>
                <span>Loading...</span>
              </div>
            }
          >
            {selectedId === '' ? (
              welcomePage || <WelcomePage tools={allTools} />
            ) : (
              <>
                {selectedTool ? (
                  <>
                    <ContentHeader
                      title={selectedTitle}
                      description={selectedDescription}
                    >
                      {selectedTool.headerButtons}
                      {selectedTool.showOpenInNewWindowButton !== false && (
                        <TooltipTrigger>
                          <ButtonIcon
                            aria-label={t('toolsPage.tabPanel.tooltipTitle')}
                            icon={<RiExternalLinkLine size={16} />}
                            variant="secondary"
                            onPress={() => openToolInWindow(selectedTool.id)}
                          />
                          <Tooltip>
                            {t('toolsPage.tabPanel.tooltipTitle')}
                          </Tooltip>
                        </TooltipTrigger>
                      )}
                      {selectedTool.showFavoriteButton !== false && (
                        <FavoriteButton toolId={selectedTool.id} />
                      )}
                    </ContentHeader>
                    {selectedTool.component}
                  </>
                ) : (
                  welcomePage || <WelcomePage tools={allTools} />
                )}
              </>
            )}
          </Suspense>
        </div>
      </div>
    </Content>
  );
};
