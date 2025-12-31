import { ReactElement, Suspense, useEffect, useMemo, useState } from 'react';
import { Content, ContentHeader } from '@backstage/core-components';
import { useFavoriteStorage } from '../../utils/hooks';
import SearchIcon from '@material-ui/icons/Search';
import { getSortedTools } from '../../utils/tools';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { FavoriteButton } from '../Buttons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalytics } from '@backstage/core-plugin-api';
import { WelcomePage } from '../WelcomePage/WelcomePage';
import { Tool } from '@drodil/backstage-plugin-toolbox-react';
import { NewIndicator } from '../Badges/NewIndicator';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Theme,
  Tooltip,
} from '@material-ui/core';
import { TabContext, TabPanel } from '@material-ui/lab';
import { useBackendTools, useToolboxTranslation } from '../../hooks';
import CardTravel from '@material-ui/icons/CardTravel';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    margin: 0,
    width: '100%',
    padding: 0,
  },
  sidebar: {
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
  },
  searchPaper: {
    justifyContent: 'center',
    margin: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    height: '48px',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    paddingRight: 0,
  },
  mainTab: {
    width: '100%',
    padding: 0,
    fontSize: '14px',
    marginTop: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
  },
  categoryTab: {
    marginTop: '8px',
    fontSize: '16px',
    fontColor: theme.palette.text.secondary,
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingBottom: 0,
  },
  toolTab: {
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  hiddenTab: {
    display: 'none',
  },
  tabs: {
    height: 'calc(100vh - 160px)',
    '& .MuiTab-root': {
      '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
      },
    },
  },
  content: {
    padding: 0,
  },
   tabLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

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
  const classes = useStyles();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const [value, setValue] = useState(1);
  const [search, setSearch] = useState('');
  const backendTools = useBackendTools();
  const favorites = useFavoriteStorage();

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

  const tabs: TabInfo[] = useMemo(() => {
    const tabInfos: TabInfo[] = [];

    tabInfos.push({
      id: '',
      tab: (
        <Tab
          key="toolbox"
          wrapped
          className={classes.mainTab}
          label={t('toolsPage.tabPanel.mainLabel')}
          icon={<CardTravel fontSize="small" />}
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
      .forEach(([category, categoryTools]) => {
        const anyMatchSearch = categoryTools.some(tool => matchesSearch(tool));

        tabInfos.push({
          tab: (
            <Tab
              className={
                !anyMatchSearch ? classes.hiddenTab : classes.categoryTab
              }
              key={category}
              label={category}
              disabled
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
          .forEach((tool, i) => {
            tabInfos.push({
              tab: (
                <Tab
                  key={tool.name}
                  className={
                    !matchesSearch(tool) ? classes.hiddenTab : classes.toolTab
                  }
                  wrapped
                 label={
                    <Box className={classes.tabLabel}>
                      {t(`tool.${tool.id}.name`, {
                        defaultValue: tool.displayName ?? tool.name,
                      })}
                      {tool.isNew && (
                        <NewIndicator
                          label={t('welcomePage.badge.new', {
                            defaultValue: 'New',
                          })}
                          ariaLabel={t('welcomePage.badge.new', {
                            defaultValue: 'New',
                          })}
                        />
                      )}
                    </Box>
                  }
                  {...tabProps(i)}
                />
              ),
              localizedTitle: `${category} - ${t(`tool.${tool.id}.name`, {
                defaultValue: tool.displayName ?? tool.name,
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
    allTools,
    favoritesCategory,
    search,
    categorySortFunction,
    toolSortFunction,
    welcomePage,
    t,
    classes,
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
    <Content noPadding>
      <Grid container spacing={2} direction="row" className={classes.container}>
        <Grid item xs={4} md={3} lg={2} className={classes.sidebar}>
          <Paper component="form" className={classes.searchPaper}>
            <InputBase
              placeholder={t('toolsPage.input.search')}
              inputProps={{ 'aria-label': 'Search' }}
              onChange={e => setSearch(e.target.value)}
            />
            <IconButton
              disabled
              aria-label="search"
              className={classes.searchIcon}
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
            className={classes.tabs}
          >
            {tabs.map(tab => tab.tab)}
          </Tabs>
        </Grid>
        <Grid item xs={8} md={9} lg={10} className={classes.content}>
          <Suspense
            fallback={
              <Box className={classes.loadingContainer}>
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
  );
};
