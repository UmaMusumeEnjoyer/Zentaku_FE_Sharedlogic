import { AnimeListData } from './AnimeListCard.types';

export const useTopListsSection = (lists: AnimeListData[]) => {
  // Logic kiểm tra đơn giản để quyết định có render hay không
  const hasLists = Array.isArray(lists) && lists.length > 0;

  return {
    hasLists
  };
};