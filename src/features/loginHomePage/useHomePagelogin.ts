import { useState, useEffect } from 'react';
import { UserAnimeCollections } from './HomePagelogin.types';
import { userService } from '../../services/user.service';

export const useHomePagelogin = () => {
  // Gom tất cả các list vào một state object cho gọn
  const [animeLists, setAnimeLists] = useState<UserAnimeCollections>({
    watching: [],
    completed: [],
    onHold: [],
    dropped: [],
    planning: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const username = localStorage.getItem('username');

        if (username) {
          const response = await userService.getUserAnimeList(username);
          
          if (response.data) {
            // Map dữ liệu từ API vào State
            // Convert backend fields (cover_image, title_english) to frontend AnimeData format (coverImage, title)
            const mapAnimeList = (list: any[]) => {
              if (!Array.isArray(list)) return [];
              return list.map(item => ({
                ...item,
                id: item.anilist_id || item.id,
                title: {
                  english: item.title_english || item.name_english,
                  romaji: item.title_romaji || item.name_romaji,
                  native: item.title_native || item.name_native,
                },
                coverImage: {
                  large: item.cover_image,
                  medium: item.cover_image,
                }
              }));
            };

            setAnimeLists({
              watching: mapAnimeList(response.data.watching || []),
              completed: mapAnimeList(response.data.completed || []),
              onHold: mapAnimeList(response.data.on_hold || response.data.paused || []),
              dropped: mapAnimeList(response.data.dropped || []),
              planning: mapAnimeList(response.data.plan_to_watch || response.data.planning || [])
            });
          }
        } else {
            console.warn("No username found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching user anime list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Logic kiểm tra danh sách rỗng
  const allListsAreEmpty = 
    animeLists.watching.length === 0 &&
    animeLists.planning.length === 0 &&
    animeLists.completed.length === 0 &&
    animeLists.onHold.length === 0 &&
    animeLists.dropped.length === 0;

  return {
    animeLists,
    loading,
    allListsAreEmpty
  };
};