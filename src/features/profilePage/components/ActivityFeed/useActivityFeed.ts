import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../../../services/user.service';
import { ActivityItem } from './ActivityFeed.types';

export const useActivityFeed = (filterDate?: string) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  
  const username = localStorage.getItem('username');

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const res = await userService.getUserActivity(username);
          setActivities(res.data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  // --- 2. FILTER & PAGINATION ---
  const filteredItems = useMemo(() => {
    if (!filterDate) return activities;

    return activities.filter(item => {
      // Tính toán ngày dựa trên ago_seconds
      const actionDate = new Date(Date.now() - item.ago_seconds * 1000);
      const actionDateStr = actionDate.toISOString().split('T')[0];
      return actionDateStr === filterDate;
    });
  }, [activities, filterDate]);

  const displayItems = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => setVisibleCount(prev => prev + 10);

  // --- 3. HELPER FUNCTIONS (Logic hiển thị) ---
  
  const formatTimeAgo = (s: number) => {
    if (s < 60) return 'now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  };

  const getActionClass = (type: string) => {
    switch (type) {
      case 'followed_anime': 
      case 'create_list': 
        return 'feed-icon-add';
      case 'updated_followed_anime': 
        return 'feed-icon-update';
      default: 
        return 'feed-icon-default';
    }
  };

  const getActionIconChar = (type: string) => {
    if (type === 'create_list') return '☰'; 
    if (type === 'followed_anime') return '+';
    if (type.includes('update')) return '✎';
    return '•';
  };

  const getActionDescription = (type: string) => {
    switch (type) {
      case 'followed_anime':
        return 'followed anime';
      case 'create_list':
        return 'created custom list';
      case 'updated_followed_anime':
        return 'updated progress';
      default:
        return 'performed action';
    }
  };

  const getTargetName = (item: ActivityItem) => {
    if (item.action_type === 'create_list') {
      return item.metadata?.list_name || "Unnamed List";
    }
    return item.metadata?.title || "Unknown Anime";
  };

  // --- 4. NAVIGATION LOGIC ---
  const getTargetUrl = (item: ActivityItem) => {
    if (item.action_type === 'create_list') {
      return `/list/${item.target_id}`;
    }
    return `/anime/${item.target_id}`;
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
    getActionClass,
    getActionIconChar,
    getActionDescription,
    getTargetName
  };
};