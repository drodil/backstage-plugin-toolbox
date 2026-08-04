import { useFavoriteStorage } from '../../utils/hooks';
import { TooltipTrigger, Tooltip, ButtonIcon } from '@backstage/ui';
import { RiStarFill, RiStarLine } from '@remixicon/react';
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
    <TooltipTrigger>
      <ButtonIcon
        aria-label={
          isFavorite
            ? t('components.favoriteButton.tooltipTitleFavorite')
            : t('components.favoriteButton.tooltipTitleNotFavorite')
        }
        icon={isFavorite ? <RiStarFill size={20} /> : <RiStarLine size={20} />}
        variant="secondary"
        onPress={handleClick}
      />
      <Tooltip>
        {isFavorite
          ? t('components.favoriteButton.tooltipTitleFavorite')
          : t('components.favoriteButton.tooltipTitleNotFavorite')}
      </Tooltip>
    </TooltipTrigger>
  );
};
