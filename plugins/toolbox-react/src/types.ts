import { ReactElement } from 'react';

export type Tool = {
  id: string;
  name: string;
  displayName?: string;
  component: ReactElement;
  aliases?: string[];
  showOpenInNewWindowButton?: boolean;
  showFavoriteButton?: boolean;
  description?: string;
  category?: string;
  headerButtons?: ReactElement[];
  requiresBackend?: boolean;
  isNew?: boolean;
};
