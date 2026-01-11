import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../../../services/user.service';
import { listService } from '../../../../services/list.service';
import { SearchUser, ListMember_userSearchModal as ListMember } from './userSearchModal.types';
import { useDebounce } from './useDebounce';

export const useUserSearchModal = (
  isOpen: boolean,
  listId: string,
  roleType: 'editor' | 'viewer',
  currentMembers: ListMember[],
  onUserAdded: () => void,
  onClose: () => void
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isEditorMode = roleType === 'editor';

  // Search & Filter Logic
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      // Hiển thị suggested users từ currentMembers
      const suggestedUsers = currentMembers.filter(member => {
        if (member.is_owner) return false;
        if (isEditorMode) {
          return !member.can_edit;
        } else {
          return member.can_edit;
        }
      });
      setResults(suggestedUsers as SearchUser[]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userService.searchUsers(debouncedSearchTerm);
        if (res.data && Array.isArray(res.data.results)) {
          setResults(res.data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search API failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm, currentMembers, isEditorMode]);

  // Handler: Close modal
  const handleClose = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    onClose();
  }, [onClose]);

  // Handler: Add/Update user
  const handleAddUser = useCallback(async (user: SearchUser) => {
    setProcessingIds(prev => [...prev, user.username]);

    const existingMember = currentMembers.find(m => m.username === user.username);

    if (existingMember && existingMember.is_owner) {
      alert("Cannot change permissions of the List Owner.");
      setProcessingIds(prev => prev.filter(id => id !== user.username));
      return;
    }

    try {
      if (isEditorMode) {
        if (existingMember) {
          await listService.updateMemberPermission(listId, {
            username: user.username,
            can_edit: true
          });
        } else {
          await listService.addMemberToList(listId, {
            username: user.username,
            can_edit: true
          });
        }
      } else {
        if (existingMember) {
          if (existingMember.can_edit) {
            await listService.updateMemberPermission(listId, {
              username: user.username,
              can_edit: false
            });
          } else {
            alert(`${user.username} is already a viewer.`);
            setProcessingIds(prev => prev.filter(id => id !== user.username));
            return;
          }
        } else {
          await listService.addMemberToList(listId, {
            username: user.username,
            permission_level: 'view'
          });
        }
      }

      onUserAdded();
    } catch (error) {
      console.error(error);
      alert(`Failed to process action for ${user.username}.`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== user.username));
    }
  }, [listId, isEditorMode, currentMembers, onUserAdded]);

  return {
    // State
    searchTerm,
    results,
    loading,
    processingIds,
    isEditorMode,

    // Methods
    setSearchTerm,
    handleClose,
    handleAddUser,
  };
};