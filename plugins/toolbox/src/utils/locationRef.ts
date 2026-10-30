const FALLBACK_LOCATION = 'url:https://localhost/entity-validator';

/** Location ref to validate an entity against, falling back to a placeholder when no URL is given. */
export const toLocationRef = (locationUrl: string): string => {
  const trimmed = locationUrl.trim();
  return trimmed ? `url:${trimmed}` : FALLBACK_LOCATION;
};
