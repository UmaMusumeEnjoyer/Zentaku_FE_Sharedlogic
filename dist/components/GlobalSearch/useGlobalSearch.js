var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/components/GlobalSearch/useGlobalSearch.ts
import { useState, useEffect } from 'react';
// XÓA: import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};
// Thêm onUserSelect vào params
export const useGlobalSearch = (isOpen, onClose, onUserSelect // ← Callback để parent xử lý navigation
) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // XÓA: const navigate = useNavigate();
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setResults([]);
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
                console.error("Search failed:", error);
                setResults([]);
            }
            finally {
                setLoading(false);
            }
        });
        fetchData();
    }, [debouncedSearchTerm]);
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setResults([]);
        }
    }, [isOpen]);
    const handleUserClick = (username) => {
        onUserSelect(username); // ← Gọi callback thay vì navigate
        onClose();
    };
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };
    return {
        searchTerm,
        results,
        loading,
        handleInputChange,
        handleUserClick
    };
};
//# sourceMappingURL=useGlobalSearch.js.map