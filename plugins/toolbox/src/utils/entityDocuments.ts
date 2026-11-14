import { Entity } from '@backstage/catalog-model';
import YAML from 'yaml';

export type ValidationError = { name: string; message: string };

export type EntityDocument =
  | { type: 'entity'; label: string; entity: Entity }
  | { type: 'error'; label: string; error: ValidationError };

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const labelOf = (entity: JsonObject, fallback: string): string => {
  const name = isObject(entity.metadata) ? entity.metadata.name : undefined;
  return typeof entity.kind === 'string' && typeof name === 'string'
    ? `${entity.kind}:${name}`
    : fallback;
};

const rootTypeOf = (value: unknown): string =>
  Array.isArray(value) ? 'array' : typeof value;

const parseDocument = (
  document: YAML.Document.Parsed,
  index: number,
): EntityDocument[] => {
  const position = `#${index + 1}`;
  if (document.errors.length > 0) {
    return [{ type: 'error', label: position, error: document.errors[0] }];
  }

  const value: unknown = document.toJS();
  if (value === null) {
    return [];
  }
  if (!isObject(value)) {
    const message = `Expected object at root, got ${rootTypeOf(value)}`;
    return [
      {
        type: 'error',
        label: position,
        error: { name: 'InputError', message },
      },
    ];
  }

  // The catalog validates the entity shape
  const entity = value as Entity;
  return [{ type: 'entity', label: labelOf(value, position), entity }];
};

/** Splits catalog YAML into labelled entity documents, as catalog ingestion does. */
export const parseEntityDocuments = (input: string): EntityDocument[] =>
  YAML.parseAllDocuments(input).flatMap(parseDocument);

/** Prefixes each error with its entity's label once there is more than one entity. */
export const labelErrors = (
  documents: EntityDocument[],
  results: ValidationError[][],
): ValidationError[] =>
  documents.length === 1
    ? results.flat()
    : results.flatMap((errors, i) =>
        errors.map(error => ({
          ...error,
          name: `${documents[i].label} ${error.name}`,
        })),
      );
