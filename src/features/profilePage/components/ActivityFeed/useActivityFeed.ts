import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../../../services/user.service';
import { ActivityItem } from './ActivityFeed.types';

interface UseActivityFeedParams {
  userId?: string | number;
  username: string;
  filterDate?: string;
  t: (key: string, options?: any) => string; // Thêm hàm dịch
}

export const useActivityFeed = ({ userId, username, filterDate, t }: UseActivityFeedParams) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  
  

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const res = await userService.getUserActivity(userId);
          setActivities(res.data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // --- 2. FILTER & PAGINATION ---
  const filteredItems = useMemo(() => {
    if (!filterDate) return activities;

    return activities.filter(item => {
      if (!item.createdAt) return false;
      const actionDate = new Date(item.createdAt);
      const actionDateStr = actionDate.toISOString().split('T')[0];
      return actionDateStr === filterDate;
    });
  }, [activities, filterDate]);

  const displayItems = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => setVisibleCount(prev => prev + 10);

  // --- 3. HELPER FUNCTIONS (Logic hiển thị) ---
  
  const formatTimeAgo = (s: number) => {
    if (s < 60) return t('ActivityFeed:time.now');
    if (s < 3600) return t('ActivityFeed:time.minutes_ago', { count: Math.floor(s/60) });
    if (s < 86400) return t('ActivityFeed:time.hours_ago', { count: Math.floor(s/3600) });
    return t('ActivityFeed:time.days_ago', { count: Math.floor(s/86400) });
  };

  const getAgoSeconds = (item: ActivityItem) => {
    if (!item.createdAt) return 0;
    return Math.floor((Date.now() - new Date(item.createdAt).getTime()) / 1000);
  };

  const getActionClass = (item: ActivityItem) => {
    if (item.type === 'MEDIA_FOLLOW') {
      if (item.metaData?.action === 'FOLLOW') return 'feed-icon-add';
      return 'feed-icon-update';
    }
    return 'feed-icon-default';
  };

  const getActionIconChar = (item: ActivityItem) => {
    if (item.type === 'MEDIA_FOLLOW') {
      if (item.metaData?.action === 'FOLLOW') return '+';
      return '✎';
    }
    return '•';
  };

  const getActionDescription = (item: ActivityItem) => {
    if (item.type === 'MEDIA_FOLLOW') {
      if (item.metaData?.action === 'FOLLOW') return t('ActivityFeed:actions.followed_anime');
      return t('ActivityFeed:actions.updated_followed_anime');
    }
    return t('ActivityFeed:actions.default');
  };

  const getTargetName = (item: ActivityItem) => {
    return item.metaData?.targetName || item.media?.titleRomaji || item.media?.titleEnglish || t('ActivityFeed:targets.unknown_anime');
  };

  // --- 4. NAVIGATION LOGIC ---
  const getTargetUrl = (item: ActivityItem) => {
    return `/anime/${item.metaData?.targetId || item.mediaId}`;
  };

  return {
    // Data
    username,
    loading,
    displayItems,
    canLoadMore,
    hasActivity: filteredItems.length > 0,
    
    // Actions
    handleLoadMore,
    getTargetUrl,

    // Helpers
    formatTimeAgo,
    getAgoSeconds,
    getActionClass,
    getActionIconChar,
    getActionDescription,
    getTargetName
  };
};