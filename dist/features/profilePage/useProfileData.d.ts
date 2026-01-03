import { UserProfile } from './profilePage.types';
export interface UseProfileDataOptions {
    routeUsername?: string;
    loggedInUsername?: string;
    onUserUpdate?: (user: UserProfile) => void;
    onNavigate?: (path: string) => void;
}
export declare const useProfileData: (options: UseProfileDataOptions) => {
    userProfile: UserProfile | null;
    targetUsername: string;
    isOwnProfile: boolean;
    loading: boolean;
    handleUpdateSuccess: (updatedUser: UserProfile) => void;
};
//# sourceMappingURL=useProfileData.d.ts.map