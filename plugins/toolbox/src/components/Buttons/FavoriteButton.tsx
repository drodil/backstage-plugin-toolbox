import { useFavoriteStorage } from '../../utils/hooks';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Star from '@mui/icons-material/Star';
import StarOutline from '@mui/icons-material/StarOutline';
import { useToolboxTranslation } from '../../hooks';

type Props = {
  toolId: string;
};

export const FAVORITES_STORAGE = 'toolboxFavorites';
export const FavoriteButton = (props: Props) => {
  const { toolId } = props;
  const currentFavorites = useFavoriteStorage();
  const { t } = useToolboxTranslation();
  const handleClick = () => {
    try {
      const favorites = localStorage.getItem(FAVORITES_STORAGE);
      const favoriteList: string[] =
        favorites !== null ? JSON.parse(favorites) : [];
      if (favoriteList.includes(toolId)) {
        localStorage.setItem(
          'toolboxFavorites',
          JSON.stringify(favoriteList.filter(item => item !== toolId)),
        );
      } else {
        favoriteList.push(toolId);
        localStorage.setItem(FAVORITES_STORAGE, JSON.stringify(favoriteList));
      }
    } catch (_) {
      localStorage.removeItem(FAVORITES_STORAGE);
    }
    window.dispatchEvent(
      new CustomEvent(FAVORITES_STORAGE, { detail: toolId }),
    );
  };

  const isFavorite = currentFavorites.includes(toolId);
  return (
    <Tooltip
      title={
        isFavorite
          ? t('components.favoriteButton.tooltipTitleFavorite')
          : t('components.favoriteButton.tooltipTitleNotFavorite')
      }
      arrow
    >
      <Button onClick={handleClick} color="inherit">
        {isFavorite ? <Star /> : <StarOutline />}
      </Button>
    </Tooltip>
  );
};
