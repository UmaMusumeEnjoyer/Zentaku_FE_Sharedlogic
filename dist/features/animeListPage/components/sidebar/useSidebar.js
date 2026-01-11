import { useMemo } from 'react';
export const useSidebar = (members = []) => {
    const permissionLevel = typeof localStorage !== 'undefined'
        ? localStorage.getItem("permission_level")
        : null;
    const currentUsername = typeof localStorage !== 'undefined'
        ? localStorage.getItem("username")
        : null;
    const isCurrentUserOwner = permissionLevel === "owner";
    // Phân loại members theo role
    const categorizedMembers = useMemo(() => {
        let owner = null;
        const editors = [];
        const viewers = [];
        members.forEach((member) => {
            if (member.is_owner) {
                owner = member;
            }
            else if (member.permission_level === 'edit' || member.can_edit) {
                editors.push(member);
            }
            else {
                viewers.push(member);
            }
        });
        return { owner, editors, viewers };
    }, [members]);
    return {
        // State
        currentUsername,
        isCurrentUserOwner,
        categorizedMembers,
        hasMembers: members.length > 0,
    };
};
//# sourceMappingURL=useSidebar.js.map