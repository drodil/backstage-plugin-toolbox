import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import {
  Grid,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import { Base64Encode } from '../Encoders/Base64Encode';
import { TabContext, TabPanel } from '@material-ui/lab';
import { UrlEncode } from '../Encoders/UrlEncode';
import { NumberBase } from '../Converters/NumberBase';
import { useStyles } from '../../utils/hooks';
import SearchIcon from '@material-ui/icons/Search';
import { MarkdownPreview } from '../Converters/MarkdownPreview';
import { JsonToYaml } from '../Converters/JsonToYaml';
import { YamlToJson } from '../Converters/YamlToJson';
import { HtmlEntities } from '../Encoders/HtmlEntities';
import { CsvToJson } from '../Converters/CsvToJson';

export type Tool = {
  name: string;
  component: JSX.Element;
  description?: string;
  category?: string;
};

const defaultTools: Tool[] = [
  {
    name: 'Base64 encode/decode',
    component: <Base64Encode />,
    category: 'Encoding/Decoding',
  },
  {
    name: 'URL encode/decode',
    component: <UrlEncode />,
    category: 'Encoding/Decoding',
  },
  {
    name: 'HTML entity encode/decode',
    component: <HtmlEntities />,
    category: 'Encoding/Decoding',
  },
  {
    name: 'Number base converter',
    component: <NumberBase />,
    category: 'Conversion',
  },
  {
    name: 'Markdown preview',
    component: <MarkdownPreview />,
  },
  {
    name: 'CSV to JSON',
    component: <CsvToJson />,
    category: 'Conversion',
  },
  {
    name: 'JSON to YAML',
    component: <JsonToYaml />,
    category: 'Conversion',
  },
  {
    name: 'YAML to JSON',
    component: <YamlToJson />,
    category: 'Conversion',
  },
];

const tabProps = (index: number) => {
  return {
    id: `toolbox-tab-${index}`,
    'aria-controls': `toolbox-tabpanel-${index}`,
  };
};

type Props = {
  extraTools?: Tool[];
};

export const Root = (props: Props) => {
  const { extraTools } = props;
  const [value, setValue] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const styles = useStyles();

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  const allTools = [...(extraTools ?? []), ...defaultTools]
    .sort((a, b) => (b.category ?? '').localeCompare(a.category ?? ''))
    .map((tool, i) => ({ ...tool, id: i }));

  const categories: { [key: string]: Tool[] } = allTools.reduce((ctgs, tab) => {
    const category = ctgs[tab.category ?? 'Miscellaneous'] || [];
    category.push(tab);
    ctgs[tab.category ?? 'Miscellaneous'] = category;
    return ctgs;
  }, {} as Record<string, Tool[]>);

  const tabs: { tab: JSX.Element; component: JSX.Element | undefined }[] = [];
  Object.entries(categories).map(([category, tools]) => {
    tabs.push({
      tab: <Tab label={category} disabled className={styles.tabDivider} />,
      component: undefined,
    });
    tools.map((tool, i) => {
      tabs.push({
        tab: (
          <Tab
            key={i}
            style={
              search && !tool.name.toLowerCase().includes(search.toLowerCase())
                ? { display: 'none' }
                : {}
            }
            wrapped
            className={styles.fullWidth}
            label={tool.name}
            {...tabProps(i)}
          />
        ),
        component: tool.component,
      });
    });
  });

  return (
    <Page themeId="tool">
      <Header title="Toolbox" />
      <Content className={styles.noPadding}>
        <Grid
          container
          spacing={2}
          direction="row-reverse"
          className={`${styles.fullHeight} ${styles.noMargin} ${styles.fullWidth} ${styles.noPadding}`}
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
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="Tools selection"
            >
              {tabs.map(tab => tab.tab)}
            </Tabs>
          </Grid>
          <Grid item xs={8} md={9} lg={10}>
            <TabContext value={`toolbox-tabpanel-${value}`}>
              {tabs.map((tool, i) => {
                return (
                  <TabPanel value={`toolbox-tabpanel-${i}`}>
                    {tool.component}
                  </TabPanel>
                );
              })}
            </TabContext>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
