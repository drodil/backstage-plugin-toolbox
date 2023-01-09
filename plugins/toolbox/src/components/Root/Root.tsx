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

export type Tool = {
  name: string;
  component: JSX.Element;
  description?: string;
};

const defaultTools: Tool[] = [
  {
    name: 'Base64 encode/decode',
    component: <Base64Encode />,
  },
  {
    name: 'URL encode/decode',
    component: <UrlEncode />,
  },
  {
    name: 'Number base converter',
    component: <NumberBase />,
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
  const [value, setValue] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const styles = useStyles();

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [...(extraTools ?? []), ...defaultTools];

  return (
    <Page themeId="tool">
      <Header title="toolbox" />
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
              className={styles.menuTabs}
            >
              {tabs.map((tab, i) => (
                <Tab
                  style={
                    search &&
                    !tab.name.toLowerCase().includes(search.toLowerCase())
                      ? { display: 'none' }
                      : {}
                  }
                  wrapped
                  className={styles.fullWidth}
                  label={tab.name}
                  {...tabProps(i)}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={8} md={9} lg={10}>
            <TabContext value={`toolbox-tabpanel-${value}`}>
              {tabs.map((tab, i) => {
                return (
                  <TabPanel value={`toolbox-tabpanel-${i}`}>
                    {tab.component}
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
