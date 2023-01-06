# Getting started

## Installation

Add the plugin to your frontend app:

```bash
cd packages/app && yarn add @drodil/backstage-plugin-devtools
```

Expose the questions page:

```ts
// packages/app/src/App.tsx
import { DevtoolsPage } from '@drodil/backstage-plugin-devtools';

// ...

const AppRoutes = () => (
  <FlatRoutes>
    // ...
    <Route path="/devtools" element={<DevtoolsPage />} />
    // ...
  </FlatRoutes>
);
```

An interface for DevTools is now available at `/devtools`.
