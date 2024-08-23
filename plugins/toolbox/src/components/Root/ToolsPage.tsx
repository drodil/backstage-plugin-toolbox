import React, { ReactElement, Suspense, useEffect, useMemo } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  Page,
} from '@backstage/core-components';
import { useFavoriteStorage, useStyles } from '../../utils/hooks';
import SearchIcon from '@mui/icons-material/Search';
import { defaultTools } from './tools';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { FavoriteButton } from '../Buttons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalytics } from '@backstage/core-plugin-api';
import { WelcomePage } from '../WelcomePage/WelcomePage';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { useBackendTools, useToolboxTranslation } from '../../hooks';

type TabInfo = {
  tab: ReactElement;
  component: ReactElement | undefined;
  id: string;
  localizedTitle: string;
  showOpenInNewWindowButton?: boolean;
  showFavoriteButton?: boolean;
  description?: string;
  localizedDescription?: string;
  headerButtons?: ReactElement[];
};

const tabProps = (index: number) => {
  return {
    id: `toolbox-tab-${index}`,
    'aria-controls': `toolbox-tabpanel-${index}`,
  };
};

export type ToolsPageProps = {
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

export const ToolsPage = (props: ToolsPageProps) => {
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
  const [value, setValue] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const backendTools = useBackendTools();
  const favorites = useFavoriteStorage();
  const { classes } = useStyles();

  const { t } = useToolboxTranslation();

  const openToolInWindow = (id: string) => {
    window.open(`/toolbox/tool/${id}`, 'newwindow', 'width=1000,height=800');
    return false;
  };

  useEffect(() => {
    if (value === 0) {
      setValue(1);
    }
  }, [value]);

  const tabs: TabInfo[] = useMemo(() => {
    const tabInfos: TabInfo[] = [];
    const favoritesCategory = t('tool.category.favorites');
    const shownTools = tools ? tools : [...(extraTools ?? []), ...defaultTools];
    const filteredTools = shownTools
      .filter(
        tool =>
          (tool.requiresBackend === true && backendTools.includes(tool.id)) ||
          tool.requiresBackend !== true,
      )
      .filter(tool => toolFilterFunction?.(tool) ?? true);

    const allTools = filteredTools
      .map(tool => {
        if (favorites.includes(tool.id)) {
          return { ...tool, category: favoritesCategory };
        }
        return tool;
      })
      .sort((a, b) => {
        const aCategoryStr = t(
          `tool.category.${(a.category ?? 'miscellaneous').toLowerCase()}`,
          {
            defaultValue: a.category ?? 'Miscellaneous',
          },
        );
        const bCategoryStr = t(
          `tool.category.${(b.category ?? 'miscellaneous').toLowerCase()}`,
          {
            defaultValue: b.category ?? 'Miscellaneous',
          },
        );
        if (aCategoryStr === favoritesCategory) {
          return -1;
        } else if (bCategoryStr === favoritesCategory) {
          return 1;
        }
        return (aCategoryStr ?? '').localeCompare(bCategoryStr ?? '');
      });

    tabInfos.push({
      tab: (
        <Tab
          key="Toolbox"
          label=""
          disabled
          className={classes.tabDivider}
          style={{ minHeight: '2px' }}
        />
      ),
      component: undefined,
      id: 'toolbox',
      localizedTitle: '',
    });

    tabInfos.push({
      id: '',
      tab: (
        <Tab
          key="toolbox"
          wrapped
          className={`${classes.fullWidth} ${classes.noPadding} ${classes.tab}`}
          label={t('toolsPage.tabPanel.mainLabel')}
        />
      ),
      localizedTitle: t('toolsPage.pageTitle'),
      component: welcomePage || <WelcomePage tools={allTools} />,
      showFavoriteButton: false,
      showOpenInNewWindowButton: false,
    });

    const categories: { [key: string]: Tool[] } = allTools.reduce(
      (ctgs, tool) => {
        const categoryStr = t(
          `tool.category.${(tool.category ?? 'miscellaneous').toLowerCase()}`,
          {
            defaultValue: tool.category ?? 'Miscellaneous',
          },
        );
        const toolList: Tool[] = ctgs[categoryStr] || [];
        toolList.push(tool);
        ctgs[categoryStr] = toolList;
        return ctgs;
      },
      {} as Record<string, Tool[]>,
    );

    const matchesSearch = (tool: Tool) => {
      if (!search) {
        return true;
      }
      const toolName = t(`tool.${tool.id}.name`, { defaultValue: tool.name });
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

    Object.entries(categories)
      .sort(([a, _], [b, __]) => {
        if (categorySortFunction) {
          return categorySortFunction(a, b);
        } else if (a === favoritesCategory) {
          return -1;
        } else if (b === favoritesCategory) {
          return 1;
        }
        return a.localeCompare(b);
      })
      .map(([category, categoryTools]) => {
        const anyMatchSearch = categoryTools.some(tool => matchesSearch(tool));

        tabInfos.push({
          tab: (
            <Tab
              style={!anyMatchSearch ? { display: 'none' } : {}}
              key={category}
              label={category}
              disabled
              className={classes.tabDivider}
            />
          ),
          component: undefined,
          id: category,
          localizedTitle: '',
        });

        categoryTools
          .sort((a, b) => {
            if (toolSortFunction) {
              return toolSortFunction(a, b);
            }
            return a.name.localeCompare(b.name);
          })
          .map((tool, i) => {
            tabInfos.push({
              tab: (
                <Tab
                  key={tool.name}
                  style={!matchesSearch(tool) ? { display: 'none' } : {}}
                  wrapped
                  className={`${classes.fullWidth} ${classes.noPadding} ${classes.tab}`}
                  label={t(`tool.${tool.id}.name`, { defaultValue: tool.name })}
                  {...tabProps(i)}
                />
              ),
              localizedTitle: `${category} - ${t(`tool.${tool.id}.name`, {
                defaultValue: tool.name,
              })}`,
              localizedDescription: t(`tool.${tool.id}.description`, {
                defaultValue: tool.description,
              }),
              ...tool,
            });
          });
      });
    return tabInfos;
  }, [
    favorites,
    search,
    classes,
    extraTools,
    tools,
    categorySortFunction,
    toolSortFunction,
    welcomePage,
    backendTools,
    toolFilterFunction,
    t,
  ]);

  useEffect(() => {
    const idx = tabs.findIndex(tab => tab.id === hash.slice(1));
    if (idx > -1) {
      setValue(idx);
    }
  }, [hash, value, tabs]);

  const handleChange = (_: any, newValue: number) => {
    const tab = tabs[newValue];
    if (tab) {
      analytics.captureEvent('click', tab.id, {
        attributes: { toolName: tab.localizedTitle },
      });
      navigate(`#${tab.id}`);
    }
  };

  return (
    <Page themeId="tool">
      <Header title={t('toolsPage.title')} />
      <Content className={classes.noPadding}>
        <Grid
          container
          spacing={2}
          direction="row"
          className={`${classes.noMargin} ${classes.fullWidth} ${classes.noPadding}`}
        >
          <Grid item xs={4} md={3} lg={2} className={classes.toolsBar}>
            <Paper
              component="form"
              className={classes.search}
              sx={{ justifyContent: 'space-between' }}
            >
              <InputBase
                placeholder={t('toolsPage.input.search')}
                inputProps={{ 'aria-label': 'Search' }}
                onChange={e => setSearch(e.target.value)}
              />
              <IconButton
                disabled
                aria-label="search"
                sx={{ mr: '16px !important', pr: '0 !important' }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor="primary"
              value={value}
              onChange={handleChange}
              aria-label="Tools selection"
              className={classes.menuTabs}
            >
              {tabs.map(tab => tab.tab)}
            </Tabs>
          </Grid>
          <Grid item xs={8} md={9} lg={10} style={{ padding: '8px' }}>
            <Suspense
              fallback={
                <Box
                  display="flex"
                  width="100%"
                  height="50%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress />
                </Box>
              }
            >
              <TabContext value={`toolbox-tabpanel-${value}`}>
                {tabs.map((tool, i) => {
                  if (!tool.localizedTitle) {
                    return null;
                  }
                  return (
                    <TabPanel key={tool.id} value={`toolbox-tabpanel-${i}`}>
                      <ContentHeader
                        title={tool.localizedTitle}
                        description={tool.localizedDescription}
                      >
                        {tool.headerButtons}
                        {tool.showOpenInNewWindowButton !== false && (
                          <Tooltip
                            title={t('toolsPage.tabPanel.tooltipTitle')}
                            arrow
                          >
                            <Button
                              size="small"
                              onClick={() => openToolInWindow(tool.id)}
                              color="inherit"
                            >
                              <OpenInNew />
                            </Button>
                          </Tooltip>
                        )}
                        {tool.showFavoriteButton !== false && (
                          <FavoriteButton toolId={tool.id} />
                        )}
                      </ContentHeader>
                      {tool.component}
                    </TabPanel>
                  );
                })}
              </TabContext>
            </Suspense>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
