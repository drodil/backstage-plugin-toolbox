export type Tool = {
  id: string;
  name: string;
  component: JSX.Element;
  showOpenInNewWindowButton?: boolean;
  showFavoriteButton?: boolean;
  description?: string;
  category?: string;
  headerButtons?: JSX.Element[];
};
