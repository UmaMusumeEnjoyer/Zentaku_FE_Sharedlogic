import { useState, useEffect, useCallback } from 'react';
import { listService } from '../../../../services/list.service';
import { LikerUser_listHeader as LikerUser } from './listHeader.types';

export const useListHeader = (listId: string, isOwner: boolean) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  // States cho Likers Modal
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [likersList, setLikersList] = useState<LikerUser[]>([]);
  const [showingCount, setShowingCount] = useState(0);

  // Fetch like status khi mount
  useEffect(() => {
    if (!listId) return;
    
    const fetchLikeStatus = async () => {
      try {
        const res = await listService.getListLikeStatus(listId);
        setIsLiked(res.data?.data?.likedByMe || res.data?.likedByMe || false);
        setLikeCount(res.data?.data?.likeCount || res.data?.likeCount || 0);
      } catch (error) {
        console.error("Failed to fetch like status", error);
      }
    };
    
    fetchLikeStatus();
  }, [listId]);

  // Handler: Toggle like
  const handleToggleLike = useCallback(async () => {
    if (isLoadingLike || !listId) return;

    const prevIsLiked = isLiked;
    const prevCount = likeCount;
    
    // Optimistic update
    setIsLiked(!prevIsLiked);
    setLikeCount(prevIsLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    setIsLoadingLike(true);

    try {
      await listService.toggleLike(listId);
      // Dựa hoàn toàn vào optimistic update vì backend chỉ trả về message
    } catch (error) {
      // Rollback on error
      setIsLiked(prevIsLiked);
      setLikeCount(prevCount);
      console.error("Failed to toggle like", error);
    } finally {
      setIsLoadingLike(false);
    }
  }, [isLoadingLike, listId, isLiked, likeCount]);

  // Handler: View likers (only for owner)
  const handleViewLikers = useCallback(async () => {
    if (!isOwner) return;

    try {
      const payload = { limit: 20 };
      const res = await listService.getListLikers(listId, payload);
      
      const rawData = res.data?.data || res.data || {};
      setLikersList(rawData.likers || []);
      setShowingCount(rawData.showing || 0);
      setLikeCount(rawData.like_count || rawData.likeCount || 0);
      
      setShowLikersModal(true);
    } catch (error) {
      console.error("Failed to fetch likers list", error);
    }
  }, [isOwner, listId]);

  // Handler: Close likers modal
  const handleCloseLikersModal = useCallback(() => {
    setShowLikersModal(false);
  }, []);

  return {
    // State
    isLiked,
    likeCount,
    isLoadingLike,
    showLikersModal,
    likersList,
    showingCount,
    
    // Methods
    handleToggleLike,
    handleViewLikers,
    handleCloseLikersModal,
  };
};