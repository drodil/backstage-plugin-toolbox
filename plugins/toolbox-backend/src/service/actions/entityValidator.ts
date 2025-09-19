import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import YAML from 'yaml';
import { CatalogService } from '@backstage/plugin-catalog-node';

export const createEntityValidatorAction = (options: {
  actionsRegistry: ActionsRegistryService;
  catalog: CatalogService;
}) => {
  const { actionsRegistry, catalog } = options;
  actionsRegistry.register({
    name: 'validate-entity',
    title: 'Validate Entity',
    description:
      'Validate Backstage catalog entity YAML format and structure. This action can be used to validaet local catalog-info.yaml files meant to be used with the Backstage software catalog.',
    attributes: {
      readOnly: true,
      idempotent: true,
      destructive: false,
    },
    schema: {
      input: z =>
        z.object({
          yaml: z.string().describe('Entity YAML content to validate'),
        }),
      output: z =>
        z.object({
          isValid: z.boolean().describe('Whether the entity is valid'),
          isValidYaml: z.boolean().describe('Whether the YAML syntax is valid'),
          errors: z.array(z.string()).describe('Array of validation errors'),
          entity: z
            .record(z.any())
            .optional()
            .describe('Parsed entity object if valid'),
        }),
    },
    action: async ({ input, credentials }) => {
      const { yaml } = input;
      try {
        // First, try to parse the YAML
        let entity;
        try {
          entity = YAML.parse(yaml);
        } catch (yamlError) {
          return {
            output: {
              isValid: false,
              isValidYaml: false,
              errors: [`YAML parsing error: ${yamlError.message}`],
            },
          };
        }

        const resp = await catalog.validateEntity(
          entity,
          'url:https://localhost/entity-validator',
          { credentials },
        );

        return {
          output: {
            isValid: resp.valid,
            isValidYaml: true,
            errors: resp.valid ? [] : resp.errors.map(e => e.message),
            entity: resp.valid ? entity : undefined,
          },
        };
      } catch (error) {
        return {
          output: {
            isValid: false,
            isValidYaml: false,
            errors: [`Validation error: ${error.message}`],
          },
        };
      }
    },
  });
};
