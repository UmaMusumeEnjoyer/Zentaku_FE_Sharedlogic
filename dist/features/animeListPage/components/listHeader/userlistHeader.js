var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useCallback } from 'react';
import { listService } from '../../../../services/list.service';
export const useListHeader = (listId, isOwner) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLoadingLike, setIsLoadingLike] = useState(false);
    // States cho Likers Modal
    const [showLikersModal, setShowLikersModal] = useState(false);
    const [likersList, setLikersList] = useState([]);
    const [showingCount, setShowingCount] = useState(0);
    // Fetch like status khi mount
    useEffect(() => {
        if (!listId)
            return;
        const fetchLikeStatus = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const res = yield listService.getListLikeStatus(listId);
                setIsLiked(res.data.is_liked);
                setLikeCount(res.data.like_count);
            }
            catch (error) {
                console.error("Failed to fetch like status", error);
            }
        });
        fetchLikeStatus();
    }, [listId]);
    // Handler: Toggle like
    const handleToggleLike = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (isLoadingLike || !listId)
            return;
        const prevIsLiked = isLiked;
        const prevCount = likeCount;
        // Optimistic update
        setIsLiked(!prevIsLiked);
        setLikeCount(prevIsLiked ? prevCount - 1 : prevCount + 1);
        setIsLoadingLike(true);
        try {
            const res = yield listService.toggleLike(listId);
            setIsLiked(res.data.is_liked);
            setLikeCount(res.data.like_count);
        }
        catch (error) {
            // Rollback on error
            setIsLiked(prevIsLiked);
            setLikeCount(prevCount);
            console.error("Failed to toggle like", error);
        }
        finally {
            setIsLoadingLike(false);
        }
    }), [isLoadingLike, listId, isLiked, likeCount]);
    // Handler: View likers (only for owner)
    const handleViewLikers = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!isOwner)
            return;
        try {
            const payload = { limit: 20 };
            const res = yield listService.getListLikers(listId, payload);
            setLikersList(res.data.likers || []);
            setShowingCount(res.data.showing || 0);
            setLikeCount(res.data.like_count);
            setShowLikersModal(true);
        }
        catch (error) {
            console.error("Failed to fetch likers list", error);
        }
    }), [isOwner, listId]);
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
//# sourceMappingURL=userlistHeader.js.map