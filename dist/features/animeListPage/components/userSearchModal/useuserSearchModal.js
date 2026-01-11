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
import { userService } from '../../../../services/user.service';
import { listService } from '../../../../services/list.service';
import { useDebounce } from './useDebounce';
export const useUserSearchModal = (isOpen, listId, roleType, currentMembers, onUserAdded, onClose) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingIds, setProcessingIds] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const isEditorMode = roleType === 'editor';
    // Search & Filter Logic
    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            // Hiển thị suggested users từ currentMembers
            const suggestedUsers = currentMembers.filter(member => {
                if (member.is_owner)
                    return false;
                if (isEditorMode) {
                    return !member.can_edit;
                }
                else {
                    return member.can_edit;
                }
            });
            setResults(suggestedUsers);
            return;
        }
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            setLoading(true);
            try {
                const res = yield userService.searchUsers(debouncedSearchTerm);
                if (res.data && Array.isArray(res.data.results)) {
                    setResults(res.data.results);
                }
                else {
                    setResults([]);
                }
            }
            catch (error) {
                console.error("Search API failed:", error);
                setResults([]);
            }
            finally {
                setLoading(false);
            }
        });
        fetchData();
    }, [debouncedSearchTerm, currentMembers, isEditorMode]);
    // Handler: Close modal
    const handleClose = useCallback(() => {
        setSearchTerm('');
        setResults([]);
        onClose();
    }, [onClose]);
    // Handler: Add/Update user
    const handleAddUser = useCallback((user) => __awaiter(void 0, void 0, void 0, function* () {
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
                    yield listService.updateMemberPermission(listId, {
                        username: user.username,
                        can_edit: true
                    });
                }
                else {
                    yield listService.addMemberToList(listId, {
                        username: user.username,
                        can_edit: true
                    });
                }
            }
            else {
                if (existingMember) {
                    if (existingMember.can_edit) {
                        yield listService.updateMemberPermission(listId, {
                            username: user.username,
                            can_edit: false
                        });
                    }
                    else {
                        alert(`${user.username} is already a viewer.`);
                        setProcessingIds(prev => prev.filter(id => id !== user.username));
                        return;
                    }
                }
                else {
                    yield listService.addMemberToList(listId, {
                        username: user.username,
                        permission_level: 'view'
                    });
                }
            }
            onUserAdded();
        }
        catch (error) {
            console.error(error);
            alert(`Failed to process action for ${user.username}.`);
        }
        finally {
            setProcessingIds(prev => prev.filter(id => id !== user.username));
        }
    }), [listId, isEditorMode, currentMembers, onUserAdded]);
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
//# sourceMappingURL=useuserSearchModal.js.map