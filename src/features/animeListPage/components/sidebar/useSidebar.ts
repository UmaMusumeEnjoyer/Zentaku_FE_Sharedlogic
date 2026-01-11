import { useMemo } from 'react';
import {ListMember_sidebar as ListMember, CategorizedMembers } from './sidebar.types';

export const useSidebar = (members: ListMember[] = []) => {
  const permissionLevel = typeof localStorage !== 'undefined' 
    ? localStorage.getItem("permission_level") 
    : null;
  const currentUsername = typeof localStorage !== 'undefined' 
    ? localStorage.getItem("username") 
    : null;
  
  const isCurrentUserOwner = permissionLevel === "owner";

  // Phân loại members theo role
  const categorizedMembers = useMemo<CategorizedMembers>(() => {
    let owner: ListMember | null = null;
    const editors: ListMember[] = [];
    const viewers: ListMember[] = [];

    members.forEach((member) => {
      if (member.is_owner) {
        owner = member;
      } else if (member.permission_level === 'edit' || member.can_edit) {
        editors.push(member);
      } else {
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