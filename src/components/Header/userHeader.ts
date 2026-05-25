// shared-logic/src/shared/hooks/useHeader.ts
import { useState, useEffect, useCallback } from 'react';


export interface UseHeaderReturn {
  // Dropdown states
  isDropdownOpen: boolean;
  isSearchModalOpen: boolean;
  isSettingsModalOpen: boolean;
  
  // Actions
  toggleDropdown: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  
  // Utilities
  formatDateTime: (dateString: string) => string;
  getRelativeTime: (airingAt: string) => string;
  getAvatarUrl: (url?: string, defaultAvatar?: string, backendDomain?: string) => string;
}

export interface UseHeaderConfig {
  isAuthenticated: boolean;
  defaultAvatar?: string;
  backendDomain?: string;
}

export const useHeader = (config: UseHeaderConfig): UseHeaderReturn => {
  const { isAuthenticated, defaultAvatar, backendDomain } = config;
  
  // States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Actions
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  const closeSearchModal = useCallback(() => {
    setIsSearchModalOpen(false);
  }, []);

  const openSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(true);
    setIsDropdownOpen(false);
  }, []);

  const closeSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  // Utility functions
  const formatDateTime = useCallback((dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getRelativeTime = useCallback((airingAt: string): string => {
    if (!airingAt) return '';
    const now = new Date();
    const airDate = new Date(airingAt);
    const diff = airDate.getTime() - now.getTime();
    
    if (diff < 0) return 'Aired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  }, []);

  const getAvatarUrl = useCallback(
    (url?: string, defaultAvatarOverride?: string, backendDomainOverride?: string): string => {
      const fallback = defaultAvatarOverride || defaultAvatar || '';
      if (!url) return fallback;
      if (url.startsWith('http')) return url;
      
      const domain = backendDomainOverride || backendDomain || '';
      return `${domain}${url}`;
    },
    [defaultAvatar, backendDomain]
  );

  return {
    isDropdownOpen,
    isSearchModalOpen,
    isSettingsModalOpen,
    toggleDropdown,
    openSearchModal,
    closeSearchModal,
    openSettingsModal,
    closeSettingsModal,
    formatDateTime,
    getRelativeTime,
    getAvatarUrl,
  };
};