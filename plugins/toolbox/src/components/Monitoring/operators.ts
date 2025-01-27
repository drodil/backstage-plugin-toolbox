export const NUMERIC_OPERATORS = ['=', '!=', '<', '<=', '>', '>='] as const;
export const REGEX_OPERATORS = ['=', '!=', '=~', '!~'] as const;
export const ALL_OPERATORS = [...NUMERIC_OPERATORS, ...REGEX_OPERATORS] as const; 