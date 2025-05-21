import { useState, useEffect } from 'react';
import { FAVORITES_STORAGE } from '../components/Buttons/FavoriteButton';

export const useFavoriteStorage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    function checkFavorites() {
      const item = localStorage.getItem(FAVORITES_STORAGE);
      if (item) {
        try {
          setFavorites(JSON.parse(item));
        } catch (_) {
          setFavorites([]);
          localStorage.removeItem(FAVORITES_STORAGE);
        }
      }
    }

    checkFavorites();
    window.addEventListener(FAVORITES_STORAGE, checkFavorites);
    return () => {
      window.removeEventListener(FAVORITES_STORAGE, checkFavorites);
    };
  }, []);
  return favorites;
};
