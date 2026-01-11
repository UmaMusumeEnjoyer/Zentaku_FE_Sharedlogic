import { useMemo } from 'react';
import { LikerUser } from './likersModal.types';

export const useLikersModal = (
  likersData: LikerUser[],
  totalLikes: number
) => {
  const isEmpty = useMemo(() => likersData.length === 0, [likersData]);
  
  const displayCount = useMemo(() => likersData.length, [likersData]);

  return {
    isEmpty,
    displayCount,
  };
};