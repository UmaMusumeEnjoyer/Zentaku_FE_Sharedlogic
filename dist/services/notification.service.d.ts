import { NotificationListResponse, GetNotificationsParams } from '../shared/types/notification.types';
export declare const notificationService: {
    getPreferences: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
    updatePreferences: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getMyNotifications: (params?: GetNotificationsParams) => Promise<import("axios").AxiosResponse<NotificationListResponse, any, {}>>;
};
//# sourceMappingURL=notification.service.d.ts.map