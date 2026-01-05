import { useState, KeyboardEvent } from 'react';

export const useListSearchBar = (onSearch?: (keyword: string) => void) => {
  const [keyword, setKeyword] = useState('');

  const handleSearchAction = () => {
    if (onSearch) {
      onSearch(keyword);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchAction();
    }
  };

  return {
    keyword,
    setKeyword,
    handleSearchAction,
    handleKeyDown
  };
};