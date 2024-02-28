import { ReactElement } from 'react';

export type Tool = {
  id: string;
  name: string;
  component: ReactElement;
  aliases?: string[];
  showOpenInNewWindowButton?: boolean;
  showFavoriteButton?: boolean;
  description?: string;
  category?: string;
  headerButtons?: ReactElement[];
};
