// src/components/GlobalSearch/useGlobalSearch.ts
import { useState, useEffect } from 'react';
// XÓA: import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { SearchResultUser } from './GlobalSearch.types';

const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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
export const useGlobalSearch = (
  isOpen: boolean, 
  onClose: () => void,
  onUserSelect: (username: string) => void  // ← Callback để parent xử lý navigation
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResultUser[]>([]);
  const [loading, setLoading] = useState(false);
  
  // XÓA: const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
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
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  const handleUserClick = (username: string) => {
    onUserSelect(username);  // ← Gọi callback thay vì navigate
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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