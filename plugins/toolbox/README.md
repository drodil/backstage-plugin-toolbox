# toolbox

Welcome to the toolbox plugin\!

## Getting started

Run `yarn start` in the root directory and navigate to [/toolbox](http://localhost:3000/toolbox).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.

> **⚠️ v2.0.0 — New frontend system only**
>
> This version requires the new Backstage frontend system. See the
> [installation instructions](../../docs/index.md#installation) for details.

## Installation

```bash
yarn --cwd packages/app add @drodil/backstage-plugin-toolbox
```

Register the plugin in `packages/app/src/index.ts`:

```ts
import { createApp } from '@backstage/frontend-defaults';
import toolboxPlugin from '@drodil/backstage-plugin-toolbox';

const app = createApp({
  features: [
    toolboxPlugin,
    // ...
  ],
});

export default app.createRoot();
```

The toolbox is now available at `/toolbox`.

## Adding your own tools

Use `ToolboxToolBlueprint` from the main package:

```ts
import { ToolboxToolBlueprint } from '@drodil/backstage-plugin-toolbox';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { compatWrapper } from '@backstage/core-compat-api';

const myTool = ToolboxToolBlueprint.make({
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
  extensions: [myTool],
});
```

See [docs/index.md](../../docs/index.md) for full documentation.
