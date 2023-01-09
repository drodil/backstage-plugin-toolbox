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
