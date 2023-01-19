import { Button, Tooltip } from '@material-ui/core';
import React from 'react';
import StarOutline from '@material-ui/icons/StarOutline';
import Star from '@material-ui/icons/Star';
import { useFavoriteStorage } from '../../utils/hooks';

type Props = {
  toolId: string;
};

export const FAVORITES_STORAGE = 'toolboxFavorites';
export const FavoriteButton = (props: Props) => {
  const { toolId } = props;
  const currentFavorites = useFavoriteStorage();
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
          ? 'Remove this tool from favorites'
          : 'Mark this tool as favorite'
      }
      arrow
    >
      <Button onClick={handleClick}>
        {isFavorite ? <Star /> : <StarOutline />}
      </Button>
    </Tooltip>
  );
};
