import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid, Tab, Tabs } from '@material-ui/core';
import { Base64Encode } from '../Base64Encode/Base64Encode';
import { TabContext, TabPanel } from '@material-ui/lab';

const tabs = [
  {
    name: 'Base64 string encode/decode',
    component: <Base64Encode />,
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
          <Grid item xs={3}>
            <Tabs
              orientation="vertical"
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
            >
              {tabs.map((tab, i) => (
                <Tab label={tab.name} {...tabProps(i)} />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={9}>
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
