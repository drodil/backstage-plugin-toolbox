import React, { ReactElement, Suspense, useEffect, useMemo } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  Page,
} from '@backstage/core-components';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
  Tooltip,
} from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import { useFavoriteStorage, useStyles } from '../../utils/hooks';
import SearchIcon from '@material-ui/icons/Search';
import { defaultTools } from './tools';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { FavoriteButton } from '../Buttons/FavoriteButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalytics } from '@backstage/core-plugin-api';
import { WelcomePage } from '../WelcomePage/WelcomePage';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';

type TabInfo = {
  tab: ReactElement;
  component: ReactElement | undefined;
  id: string;
  title: string;
  showOpenInNewWindowButton?: boolean;
  showFavoriteButton?: boolean;
  description?: string;
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
  /** customize the landing page */
  welcomePage?: ReactElement;
};

export const ToolsPage = (props: ToolsPageProps) => {
  const { extraTools, tools, categorySortFunction, toolSortFunction } = props;
  const { hash } = useLocation();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const [value, setValue] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const favorites = useFavoriteStorage();
  const styles = useStyles();

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
    const t: TabInfo[] = [];
    const shownTools = tools ? tools : [...(extraTools ?? []), ...defaultTools];
    const allTools = shownTools
      .map(tool => {
        if (favorites.includes(tool.id)) {
          return { ...tool, category: 'Favorites' };
        }
        return tool;
      })
      .sort((a, b) => {
        if (a.category === 'Favorites') {
          return -1;
        } else if (b.category === 'Favorites') {
          return 1;
        }
        return (b.category ?? '').localeCompare(a.category ?? '');
      });

    t.push({
      tab: (
        <Tab
          key="Toolbox"
          label=""
          disabled
          className={styles.tabDivider}
          style={{ minHeight: '2px' }}
        />
      ),
      component: undefined,
      id: 'toolbox',
      title: '',
    });

    t.push({
      id: '',
      tab: (
        <Tab
          key="toolbox"
          wrapped
          className={`${styles.fullWidth} ${styles.noPadding} ${styles.tab}`}
          label="Toolbox"
        />
      ),
      title: 'Toolbox',
      component: props.welcomePage || <WelcomePage tools={allTools} />,
      showFavoriteButton: false,
      showOpenInNewWindowButton: false,
    });

    const categories: { [key: string]: Tool[] } = allTools.reduce(
      (ctgs, tool) => {
        const categoryStr = tool.category ?? 'Miscellaneous';
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
      return (
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.id.toLowerCase().includes(search.toLowerCase()) ||
        tool.aliases?.some(alias =>
          alias.toLowerCase().includes(search.toLowerCase()),
        ) ||
        tool.description?.toLowerCase().includes(search.toLowerCase())
      );
    };

    Object.entries(categories)
      .sort(([a, _], [b, __]) => {
        if (categorySortFunction) {
          return categorySortFunction(a, b);
        } else if (a === 'Favorites') {
          return -1;
        } else if (b === 'Favorites') {
          return 1;
        }
        return a.localeCompare(b);
      })
      .map(([category, categoryTools]) => {
        const anyMatchSearch = categoryTools.some(tool => matchesSearch(tool));

        t.push({
          tab: (
            <Tab
              style={!anyMatchSearch ? { display: 'none' } : {}}
              key={category}
              label={category}
              disabled
              className={styles.tabDivider}
            />
          ),
          component: undefined,
          id: category,
          title: '',
        });

        categoryTools
          .sort((a, b) => {
            if (toolSortFunction) {
              return toolSortFunction(a, b);
            }
            return a.name.localeCompare(b.name);
          })
          .map((tool, i) => {
            t.push({
              tab: (
                <Tab
                  key={tool.name}
                  style={!matchesSearch(tool) ? { display: 'none' } : {}}
                  wrapped
                  className={`${styles.fullWidth} ${styles.noPadding} ${styles.tab}`}
                  label={tool.name}
                  {...tabProps(i)}
                />
              ),
              title: `${category} - ${tool.name}`,
              ...tool,
            });
          });
      });
    return t;
  }, [
    favorites,
    search,
    styles,
    extraTools,
    tools,
    categorySortFunction,
    toolSortFunction,
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
        attributes: { toolName: tab.title },
      });
      navigate(`#${tab.id}`);
    }
  };

  return (
    <Page themeId="tool">
      <Header title="Toolbox" />
      <Content className={styles.noPadding}>
        <Grid
          container
          spacing={2}
          direction="row"
          className={`${styles.noMargin} ${styles.fullWidth} ${styles.noPadding}`}
        >
          <Grid item xs={4} md={3} lg={2} className={styles.toolsBar}>
            <Paper component="form" className={styles.search}>
              <InputBase
                placeholder="Search"
                inputProps={{ 'aria-label': 'Search' }}
                onChange={e => setSearch(e.target.value)}
              />
              <IconButton disabled aria-label="search">
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
              className={styles.menuTabs}
            >
              {tabs.map(tab => tab.tab)}
            </Tabs>
          </Grid>
          <Grid item xs={8} md={9} lg={10}>
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
                  if (!tool.title) {
                    return null;
                  }
                  return (
                    <TabPanel key={tool.id} value={`toolbox-tabpanel-${i}`}>
                      <ContentHeader
                        title={tool.title}
                        description={tool.description}
                      >
                        {tool.headerButtons}
                        {tool.showOpenInNewWindowButton !== false && (
                          <Tooltip title="Open tool in new window" arrow>
                            <Button
                              size="small"
                              onClick={() => openToolInWindow(tool.id)}
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
