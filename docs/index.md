# Getting started

## Installation

Add the plugin to your frontend app:

```bash
yarn --cwd packages/app add @drodil/backstage-plugin-toolbox
```

Expose the toolbox page:

```tsx
// packages/app/src/App.tsx
import { ToolboxPage } from '@drodil/backstage-plugin-toolbox';

const AppRoutes = () => (
  <FlatRoutes>
    // ...
    <Route path="/toolbox" element={<ToolboxPage />} />
    // ...
  </FlatRoutes>
);
```

Add the navigation in the frontend:

```tsx
// packages/app/src/components/Root/Root.tsx
import CardTravel from '@mui/icons-material/CardTravel';

// ...

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    // ...
    <SidebarItem icon={CardTravel} to="toolbox" text="ToolBox" />
    // ...
  </SidebarPage>
);
```

An interface for toolbox is now available at `/toolbox`.

## Adding your own tools

You can also add your own tools to the plugin by passing them to the ToolboxPage as a property:

```tsx
import { ToolboxPage, Tool } from '@drodil/backstage-plugin-toolbox';

const extraToolExample: Tool = {
  name: 'Extra',
  component: <div>Extra tool</div>,
};

<ToolboxPage extraTools={[extraToolExample]} />;
```

Also lazy loading is supported:

```tsx
import React, { lazy } from 'react';
import { ToolboxPage, Tool } from '@drodil/backstage-plugin-toolbox';

const MyTool = lazy(() => import('./MyTool'));

const extraToolExample: Tool = {
  name: 'Extra',
  component: <MyTool />,
};

<ToolboxPage extraTools={[extraToolExample]} />;
```

### New frontend system

To add new tools using the new frontend system, you can use the `ToolboxToolBlueprint`:

```tsx
import { ToolboxToolBlueprint } from '@drodil/backstage-plugin-toolbox/alpha';
import { createFrontendModule } from '@backstage/frontend-plugin-api';

const base64EncodeTool = ToolboxToolBlueprint.make({
  name: 'base64-encode',
  params: {
    id: 'base64-encode',
    displayName: 'Base64',
    description: 'Encode and decode base64 strings',
    category: 'Encode/Decode',
    async loader() {
      const m = await import('./components/Encoders/Base64Encode');
      return compatWrapper(<m.default />);
    },
  },
});

createFrontendModule({
  pluginId: 'toolbox',
  extensions: [base64EncodeTool],
});
```

## Adding tools to custom home page

You can add tools to the Backstage custom home page as follows:

```tsx
import { CustomHomepageGrid } from '@backstage/plugin-home';
import { ToolboxHomepageCard } from '@drodil/backstage-plugin-toolbox';
import { Content, Page } from '@backstage/core-components';

export const HomePage = () => {
  return (
    <Page themeId="home">
      <Content>
        <CustomHomepageGrid>
          <ToolboxHomepageCard />
        </CustomHomepageGrid>
      </Content>
    </Page>
  );
};
```

This allows the home page users to configure the card so that their favorite tool is available in their home page.
For more information, see https://github.com/backstage/backstage/pull/16744

## Optional backend

The plugin also supports additional backend for tools that cannot work only in the frontend. The backend can be extended
with
additional handlers by utilizing the extension point. See `plugins/toolbox-backend-module-whois` for an example.

To install backend and additional tools to it, add the following to your `packages/backend/src/index.ts`:

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@drodil/backstage-plugin-toolbox-backend'));
backend.add(import('@drodil/backstage-plugin-toolbox-backend-module-whois'));

backend.start();
```

Also add the necessary dependencies to your `packages/backend/package.json`:

```bash
yarn --cwd packages/backend add @drodil/backstage-plugin-toolbox-backend @drodil/backstage-plugin-toolbox-backend-module-whois
```

# Translations (alpha)

The plugin supports translations. To add a new language, create a new file in `packages/app/src/locales` with the
language code (e.g. `toolbox-fi.ts`).
Create the translations as described here https://backstage.io/docs/plugins/internationalization/ using the
`toolboxTranslationRef` from `@drodil/backstage-plugin-toolbox` as the translation reference:

```ts
// packages/app/src/locales/toolbox-fi.ts
import { toolboxTranslationRef } from '@drodil/backstage-plugin-toolbox';
import { createTranslationMessages } from '@backstage/core-plugin-api/alpha';

const fi = createTranslationMessages({
  ref: toolboxTranslationRef,
  full: false,
  translations: {
    'toolsPage.title': 'Työkalut',
    'welcomePage.introText': 'Käytä työkaluja helposti',
  },
});

export default fi;
```

Then add the translation to your `packages/app/src/App.tsx`:

```tsx
import { createTranslationResource } from '@backstage/core-plugin-api/alpha';
import { toolboxTranslationRef } from '@drodil/backstage-plugin-toolbox';

const app = createApp({
  //...
  __experimentalTranslations: {
    availableLanguages: ['en', 'fi'],
    resources: [
      createTranslationResource({
        ref: toolboxTranslationRef,
        translations: {
          fi: () => import('./locales/toolbox-fi'),
        },
      }),
    ],
  },
});
```

## Tool specific translations

The `tool` object inside translation ref works as a namespace for the tool translations. You can add translations for
specific tools by adding a new object inside the tools object with the tool id as the key:

```ts
createTranslationMessages({
  ref: toolboxTranslationRef,
  messages: {
    'tool.backslash-encode.name': 'My translation',
  },
});
```

This works also for custom tools added to the plugin.

Tool categories are also supported and the category key is always in lowercase:

```ts
createTranslationMessages({
  ref: toolboxTranslationRef,
  messages: {
    'tool.category.encode/decode': 'My translation',
  },
});
```

## Using predefined translations

You can also use the predefined translations from the plugin:

```ts
import { toolboxTranslations } from '@drodil/backstage-plugin-toolbox';

const app = createApp({
  //...
  __experimentalTranslations: {
    availableLanguages: ['en', 'fi'],
    resources: [toolboxTranslations],
  },
});
```

Note that these translations might not contain your desired language. If you want to add a new language, you need to
contribute it to the plugin in `plugins/toolbox/src/locales/` and add it in the `plugins/toolbox/src/translation.ts`
with the right language code.
