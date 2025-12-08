# Backstage Plugin Toolbox - Copilot Instructions

## Project Overview

This is a **Backstage.io plugin** called `backstage-plugin-toolbox` that provides a collection of developer tools within the Backstage platform. The project is a monorepo containing multiple plugin packages that work together.

## Architecture

### Plugin Packages

1. **@drodil/backstage-plugin-toolbox** (Frontend)

   - Main frontend plugin with UI components
   - Location: `plugins/toolbox/`
   - Role: Provides the user interface for various developer tools

2. **@drodil/backstage-plugin-toolbox-backend** (Backend)

   - Backend plugin that handles server-side operations
   - Location: `plugins/toolbox-backend/`
   - Role: Provides API endpoints and backend services

3. **@drodil/backstage-plugin-toolbox-node** (Node Library)

   - Shared Node.js library for backend functionality
   - Location: `plugins/toolbox-node/`
   - Role: Provides extension points and shared backend utilities

4. **@drodil/backstage-plugin-toolbox-backend-module-whois** (Backend Module)

   - Backend module for WHOIS functionality
   - Location: `plugins/toolbox-backend-module-whois/`
   - Role: Adds specific tool functionality to the backend

5. **@drodil/backstage-plugin-toolbox-react** (React Library)
   - Shared React components and utilities
   - Location: `plugins/toolbox-react/`
   - Role: Provides reusable React components and types

## Technology Stack

- **Framework**: Backstage.io
- **Language**: TypeScript
- **Runtime**: Node.js (20 || 22)
- **Package Manager**: Yarn (workspaces)
- **Build Tool**: Backstage CLI
- **Testing**: Jest (via Backstage CLI)
- **Linting**: ESLint (via Backstage CLI)
- **Database**: PostgreSQL (with SQLite support for development)

## Code Style & Conventions

### Commit Messages

- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format
- Format: `<type>(<scope>): <subject>`
- Examples: `feat(encoder): add base64 tool`, `fix(backend): resolve API endpoint issue`

### TypeScript

- Use strict TypeScript configuration
- Export types and interfaces from `index.ts` files
- Use `@backstage` types when available
- Prefer functional components with hooks over class components
- Use strict TypeScript with proper typing, avoid `any`

### File Organization

- Component files should be in PascalCase (e.g., `Base64Encode.tsx`)
- Utility files in camelCase (e.g., `hooks.ts`, `tools.ts`)
- Index files (`index.ts`/`index.tsx`) for clean exports
- Test files colocated with source: `*.test.ts` or `*.test.tsx`

### Component Structure

```typescript
// Tool component example
import React from 'react';
import { DefaultEditor } from '../DefaultEditor';

export const MyTool = () => {
  return (
    <DefaultEditor
    // component implementation
    />
  );
};
```

### Plugin Extension Pattern

- Use Backstage plugin API patterns
- Support both legacy and new frontend system
- Export alpha features from `alpha.tsx`
- Use blueprints for extensibility

## Development Workflow

### Setup Commands

```bash
yarn install              # Install dependencies
yarn docker:up           # Start PostgreSQL container
yarn dev                 # Start both frontend and backend
yarn start               # Start frontend only
yarn start-backend       # Start backend only
```

### Quality Checks

```bash
yarn lint                          # Lint all files
yarn tsc                           # Type check
yarn test                          # Run tests
yarn prettier:check                # Check formatting
yarn commitlint --from=origin/main # Commit message check
yarn dedupe                        # Deduplicate dependencies
```

### Building

```bash
yarn build               # Build all packages
yarn clean               # Clean build artifacts
```

## Adding New Tools

### Frontend Tool

1. Create component in `plugins/toolbox/src/components/<Category>/`
2. Use existing patterns (Encoders, Formatters, Generators, etc.)
3. Utilize `DefaultEditor` component for consistent UI
4. Export from category's `index.ts`
5. Register in tool list

### Backend Handler

1. Create handler in `plugins/toolbox-backend/src/service/`
2. Implement `ToolRequestHandler` interface
3. Register handler in plugin initialization
4. Add corresponding API client method

### Backend Module (for tools requiring backend)

1. Create new package in `plugins/toolbox-backend-module-<name>/`
2. Implement module using `createBackendModule`
3. Use extension points from `toolbox-node`

## Testing Requirements

- Write unit tests for all new functionality
- Maintain or improve code coverage
- Test files use Jest with Backstage test utilities
- Mock external dependencies appropriately
- Run tests locally before committing

## API Patterns

### Frontend API Client

- Extend `ToolboxClient` in `plugins/toolbox/src/api/`
- Use `DiscoveryApi` and `FetchApi` from Backstage
- Type all requests and responses

### Backend Router

- Use Express router patterns
- Handle errors appropriately
- Return JSON responses
- Use Backstage logging utilities

## Internationalization

- Translation support via `plugins/toolbox/src/locales/`
- Use translation hooks from `plugins/toolbox/src/translation.ts`
- Support for multiple languages

## Important Notes

### Backstage Integration

- This plugin integrates with Backstage's plugin system
- Follow Backstage architecture patterns and conventions
- Use Backstage components and APIs where possible
- Support both legacy and new frontend system

### Backward Compatibility

- Maintain backward compatibility when making changes
- Deprecate features properly before removal
- Document breaking changes clearly

### Database

- Default: PostgreSQL via Docker
- Alternative: SQLite (for development without Docker)
- Configuration in `app-config.yaml`

## Documentation

- User documentation in `docs/`
- Built with MkDocs (`mkdocs.yml`)
- README files in each plugin package
- Keep installation instructions up to date

## Common Patterns

### Tool Categories

- **Encoders**: Base64, URL encode, etc.
- **Converters**: JSON to YAML, timestamp conversions, etc.
- **Formatters**: JSON, XML, SQL formatting, etc.
- **Generators**: UUID, hash, password generators, etc.
- **Validators**: JSON, XML, regex validators, etc.
- **Networking**: WHOIS, DNS lookups, etc.
- **Misc**: Other utilities

### Reusable Components

- `DefaultEditor`: Standard editor interface
- `ToolboxCard`: Homepage card component
- Category-specific buttons and inputs

## CI/CD

- GitHub Actions workflow in `.github/workflows/ci.yaml`
- Runs linting, type checking, and tests
- Coverage reports generated in `coverage/`

## When Making Changes

1. **Read existing code** to understand patterns
2. **Follow the structure** of similar components
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Run quality checks** before committing
6. **Use conventional commits** for commit messages
7. **Ensure backward compatibility** or document breaking changes

## Support

- GitHub Issues: https://github.com/drodil/backstage-plugin-toolbox/issues
- See CONTRIBUTING.md for detailed contribution guidelines
