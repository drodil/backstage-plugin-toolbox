import { createEntityValidatorAction } from './entityValidator';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { CatalogService } from '@backstage/plugin-catalog-node';

describe('createEntityValidatorAction', () => {
  let mockActionsRegistry: jest.Mocked<ActionsRegistryService>;
  let mockCatalog: jest.Mocked<CatalogService>;
  let registeredAction: any;

  beforeEach(() => {
    mockActionsRegistry = {
      register: jest.fn().mockImplementation(action => {
        registeredAction = action;
      }),
    } as any;

    mockCatalog = {
      validateEntity: jest.fn().mockResolvedValue({
        valid: true,
        errors: [],
      }),
    } as any;

    createEntityValidatorAction({
      actionsRegistry: mockActionsRegistry,
      catalog: mockCatalog,
    });
  });

  it('should register the action with correct metadata', () => {
    expect(mockActionsRegistry.register).toHaveBeenCalledTimes(1);
    expect(registeredAction.name).toBe('validate-entity');
    expect(registeredAction.title).toBe('Validate Entity');
    expect(registeredAction.description).toContain(
      'Validate Backstage catalog entity YAML format',
    );
    expect(registeredAction.attributes).toEqual({
      readOnly: true,
      idempotent: true,
      destructive: false,
    });
  });

  describe('action handler', () => {
    it('should validate valid entity YAML', async () => {
      const input = {
        yaml: `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-component
  title: My Component
spec:
  type: service
  lifecycle: production
  owner: team-a
        `,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(true);
      expect(result.output.isValid).toBe(true);
      expect(result.output.entity).toBeDefined();
      expect(result.output.entity.apiVersion).toBe('backstage.io/v1alpha1');
      expect(result.output.entity.kind).toBe('Component');
      expect(result.output.entity.metadata.name).toBe('my-component');
    });

    it('should handle invalid YAML syntax', async () => {
      const input = {
        yaml: `invalid: yaml
  - unclosed bracket: [
    missing closing bracket`,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(false);
      expect(result.output.errors).toHaveLength(1);
      expect(result.output.errors[0]).toContain('YAML parsing error');
    });

    it('should handle empty YAML', async () => {
      const input = { yaml: '' };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(true);
      expect(result.output.entity).toBeNull();
    });

    it('should handle catalog validation failure', async () => {
      mockCatalog.validateEntity.mockResolvedValueOnce({
        valid: false,
        errors: [
          {
            name: 'ValidationError',
            message: 'Missing required field: spec.type',
          },
        ],
      });

      const input = {
        yaml: `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: invalid-component
spec:
  lifecycle: production
        `,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(true);
      expect(result.output.isValid).toBe(false);
      expect(result.output.errors).toContain(
        'Missing required field: spec.type',
      );
    });

    it('should validate API entity', async () => {
      const input = {
        yaml: `
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: my-api
  title: My API
spec:
  type: openapi
  lifecycle: production
  owner: team-a
  definition: |
    openapi: 3.0.0
    info:
      title: My API
      version: 1.0.0
        `,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(true);
      expect(result.output.entity).toBeDefined();
      expect(result.output.entity.kind).toBe('API');
      expect(result.output.entity.spec.type).toBe('openapi');
    });

    it('should validate Group entity', async () => {
      const input = {
        yaml: `
apiVersion: backstage.io/v1alpha1
kind: Group
metadata:
  name: team-a
  title: Team A
spec:
  type: team
  children: []
        `,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(true);
      expect(result.output.entity).toBeDefined();
      expect(result.output.entity.kind).toBe('Group');
      expect(result.output.entity.spec.type).toBe('team');
    });

    it('should validate User entity', async () => {
      const input = {
        yaml: `
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: john.doe
  title: John Doe
spec:
  memberOf:
    - team-a
        `,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(true);
      expect(result.output.entity).toBeDefined();
      expect(result.output.entity.kind).toBe('User');
      expect(result.output.entity.spec.memberOf).toEqual(['team-a']);
    });

    it('should handle entity with annotations and labels', async () => {
      const input = {
        yaml: `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-component
  annotations:
    github.com/project-slug: myorg/myrepo
  labels:
    environment: production
spec:
  type: service
  lifecycle: production
  owner: team-a
        `,
      };

      const result = await registeredAction.action({ input });

      expect(result.output.isValidYaml).toBe(true);
      expect(result.output.entity).toBeDefined();
      expect(result.output.entity.metadata.annotations).toBeDefined();
      expect(result.output.entity.metadata.labels).toBeDefined();
    });
  });
});
