# Getting started

## Installation

Add the plugin to your frontend app:

```bash
cd packages/app && yarn add @drodil/backstage-plugin-toolbox
```

Expose the questions page:

```ts
// packages/app/src/App.tsx
import { ToolboxPage } from '@drodil/backstage-plugin-toolbox';

// ...

const AppRoutes = () => (
  <FlatRoutes>
    // ...
    <Route path="/toolbox" element={<ToolboxPage />} />
    // ...
  </FlatRoutes>
);
```

An interface for toolbox is now available at `/toolbox`.

## Adding your own tools

You can also add your own tools to the plugin by passing them to the ToolboxPage as a property:

```ts
import { ToolboxPage, Tool } from '@drodil/backstage-plugin-toolbox';

const extraToolExample: Tool = {
  name: 'Extra',
  component: <div>Extra tool</div>,
};

<ToolboxPage extraTools={[extraToolExample]} />;
```
