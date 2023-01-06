import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid, Tab, Tabs } from '@material-ui/core';
import { Base64Encode } from '../Base64Encode/Base64Encode';
import { TabContext, TabPanel } from '@material-ui/lab';
import { UrlEncode } from '../UrlEncode/UrlEncode';
import { NumberBase } from '../NumberBase/NumberBase';

const tabs = [
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
    id: `devtools-tab-${index}`,
    'aria-controls': `devtools-tabpanel-${index}`,
  };
};

export const Root = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Page themeId="tool">
      <Header title="DevTools" />
      <Content>
        <Grid container spacing={2} direction="row-reverse">
          <Grid item xs={2}>
            <Tabs
              orientation="vertical"
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="Tools selection"
            >
              {tabs.map((tab, i) => (
                <Tab
                  style={{ alignSelf: 'end' }}
                  label={tab.name}
                  {...tabProps(i)}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={10}>
            <TabContext value={`devtools-tabpanel-${value}`}>
              {tabs.map((tab, i) => {
                return (
                  <TabPanel value={`devtools-tabpanel-${i}`}>
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
