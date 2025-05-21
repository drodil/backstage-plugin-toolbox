import { ReactElement, Suspense, useEffect, useMemo, useState } from 'react';
import { Content, ContentHeader } from '@backstage/core-components';
import { useFavoriteStorage } from '../../utils/hooks';
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

  const tabs: TabInfo[] = useMemo(() => {
    const tabInfos: TabInfo[] = [];
    const favoritesCategory = t('tool.category.favorites');
    const shownTools = tools ?? [...(extraTools ?? []), ...defaultTools];
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
          sx={{
            marginTop: 1,
            paddingTop: 1,
            paddingBottom: '50px',
          }}
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
          sx={{
            width: '100%',
            padding: 0,
            '&:hover': {
              background: 'transparent',
            },
            '&[aria-selected="true"]': {
              fontWeight: 'bold',
            },
            marginTop: 1,
            paddingTop: 1,
            paddingBottom: '50px',
            color: 'text.primary',
          }}
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
      .forEach(([category, categoryTools]) => {
        const anyMatchSearch = categoryTools.some(tool => matchesSearch(tool));

        tabInfos.push({
          tab: (
            <Tab
              style={
                !anyMatchSearch ? { display: 'none' } : { marginTop: '0.5rem' }
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
                  style={!matchesSearch(tool) ? { display: 'none' } : {}}
                  wrapped
                  sx={{
                    width: '100%',
                    padding: 0,
                    '&:hover': {
                      background: 'transparent',
                    },
                    '&[aria-selected="true"]': {
                      fontWeight: 'bold',
                    },
                  }}
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
    <Content noPadding>
      <Grid
        container
        spacing={2}
        direction="row"
        sx={{ margin: 0, width: '100%', padding: 0 }}
      >
        <Grid
          item
          xs={4}
          md={3}
          lg={2}
          sx={theme => ({
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: '0 !important',
          })}
        >
          <Paper
            component="form"
            sx={{
              justifyContent: 'space-between',
              margin: 2,
              marginBottom: 1,
              display: 'flex',
              '& input': {
                marginLeft: 2,
                width: '100%',
                flex: 1,
              },
              height: '48px',
            }}
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
            sx={{
              height: 'calc(100vh - 160px);',
              '& div[class*="MuiTabScrollButton-vertical"]': {
                height: '10px',
              },
              '& button[class*="MuiTab-wrapped"]': {
                fontSize: '12px',
              },
              '& button[class*="Mui-disabled"]': {
                paddingTop: '8px !important',
                paddingBottom: '8px !important',
              },
            }}
          >
            {tabs.map(tab => tab.tab)}
          </Tabs>
        </Grid>
        <Grid item xs={8} md={9} lg={10} sx={{ padding: 0 }}>
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
  );
};
