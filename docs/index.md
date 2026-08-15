# Getting started

> **⚠️ v2.0.0 — New frontend system only**
>
> Version 2.0.0 requires the [new Backstage frontend system](https://backstage.io/docs/frontend-system/).
> The legacy system (`ToolboxPage`, `ToolsContainer`, `createPlugin`) has been removed.
> If you are on the legacy system, stay on v1.x.

## Installation

Add the frontend plugin to your app:

```bash
yarn --cwd packages/app add @drodil/backstage-plugin-toolbox
```

Register the plugin in your app's `packages/app/src/index.ts`:

```ts
import { createApp } from '@backstage/frontend-defaults';
import toolboxPlugin from '@drodil/backstage-plugin-toolbox';

const app = createApp({
  features: [
    toolboxPlugin,
    // ...other plugins
  ],
});

export default app.createRoot();
```

The toolbox is now available at `/toolbox`.

## Adding your own tools

Use `ToolboxToolBlueprint` (now exported from the main package, no `/alpha` sub-path required):

```ts
import { ToolboxToolBlueprint } from '@drodil/backstage-plugin-toolbox';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { compatWrapper } from '@backstage/core-compat-api';

const myCustomTool = ToolboxToolBlueprint.make({
  name: 'my-tool',
  params: {
    id: 'my-tool',
    displayName: 'My Tool',
    description: 'Does something useful',
    category: 'Miscellaneous',
    async loader() {
      const m = await import('./components/MyTool');
      return compatWrapper(<m.default />);
    },
  },
});

export default createFrontendModule({
  pluginId: 'toolbox',
  extensions: [myCustomTool],
});
```

Register the module alongside the plugin:

```ts
import { createApp } from '@backstage/frontend-defaults';
import toolboxPlugin from '@drodil/backstage-plugin-toolbox';
import myToolboxModule from './myToolboxModule';

const app = createApp({
  features: [
    toolboxPlugin,
    myToolboxModule,
    // ...
  ],
});
```

### Custom welcome page

Use `ToolboxWelcomePageBlueprint` to replace the default welcome page:

```ts
import { ToolboxWelcomePageBlueprint } from '@drodil/backstage-plugin-toolbox';

const myWelcomePage = ToolboxWelcomePageBlueprint.make({
  name: 'custom-welcome',
  params: {
    element: <MyWelcomePage />,
  },
});
```

## Optional backend

The plugin supports an optional backend for tools that cannot run entirely in the browser.

```bash
yarn --cwd packages/backend add @drodil/backstage-plugin-toolbox-backend @drodil/backstage-plugin-toolbox-backend-module-whois
```

In `packages/backend/src/index.ts`:

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@drodil/backstage-plugin-toolbox-backend'));
// Optional: adds WHOIS lookup tool
backend.add(import('@drodil/backstage-plugin-toolbox-backend-module-whois'));

backend.start();
```

# Configuration

## Disabling specific tools

Disabling a tool is done easily through `app.extensions` overrides in `app-config.yaml`.
To completely disable a tool, simply target said tool, and set the disabled attribute
to false:

```yaml
app:
  extensions:
    - toolbox-tool:toolbox/base64-encode:
        disabled: true
```

Or as a shorthand:

```yaml
app:
  extensions:
    - toolbox-tool:toolbox/base64-encode: false
```

If you would rather just exclude the tool from the toolbox page, you can instead
override the `page:toolbox` extension and set the `enabledTools` config key to an
array of the tool IDs you want to keep on the toolbox page:

```yaml
app:
  extensions:
    - page:toolbox:
        config:
          enabledTools:
            - sla-calculator
            - csr-generate
            - ...
```

# Translations

The plugin supports i18n. To add a new language, create a locale file in your app:

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

Then register it in `packages/app/src/App.tsx`:

```tsx
import { createTranslationResource } from '@backstage/core-plugin-api/alpha';
import { toolboxTranslationRef } from '@drodil/backstage-plugin-toolbox';

const app = createApp({
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

## Tool-specific translations

Override the display name or description of any tool using its ID as the key:

```ts
createTranslationMessages({
  ref: toolboxTranslationRef,
  messages: {
    'tool.backslash-encode.name': 'Backslash encoder',
    'tool.backslash-encode.description':
      'Encode and decode backslash characters',
  },
});
```

Tool categories use lowercase keys:

```ts
createTranslationMessages({
  ref: toolboxTranslationRef,
  messages: {
    'tool.category.encode/decode': 'Encode & Decode',
  },
});
```

## Using predefined translations

```ts
import { toolboxTranslations } from '@drodil/backstage-plugin-toolbox';

const app = createApp({
  __experimentalTranslations: {
    availableLanguages: ['en', 'fi'],
    resources: [toolboxTranslations],
  },
});
```

To add a new language, contribute a locale file to `plugins/toolbox/src/locales/` and register it in
`plugins/toolbox/src/translation.ts`.
