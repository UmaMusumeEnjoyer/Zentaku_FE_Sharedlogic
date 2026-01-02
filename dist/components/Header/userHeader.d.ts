import { Notification } from '../../shared/types/notification.types';
export interface UseHeaderReturn {
    isDropdownOpen: boolean;
    isSearchModalOpen: boolean;
    isNotiModalOpen: boolean;
    isSettingsModalOpen: boolean;
    notificationCount: number;
    notifications: Notification[];
    toggleDropdown: () => void;
    openSearchModal: () => void;
    closeSearchModal: () => void;
    openNotificationModal: () => void;
    closeNotificationModal: () => void;
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    formatDateTime: (dateString: string) => string;
    getRelativeTime: (airingAt: string) => string;
    getAvatarUrl: (url?: string, defaultAvatar?: string, backendDomain?: string) => string;
}
export interface UseHeaderConfig {
    isAuthenticated: boolean;
    defaultAvatar?: string;
    backendDomain?: string;
}
export declare const useHeader: (config: UseHeaderConfig) => UseHeaderReturn;
//# sourceMappingURL=userHeader.d.ts.map