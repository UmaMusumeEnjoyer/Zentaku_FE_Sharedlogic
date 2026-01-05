import { useState } from 'react';
export const useListSearchBar = (onSearch) => {
    const [keyword, setKeyword] = useState('');
    const handleSearchAction = () => {
        if (onSearch) {
            onSearch(keyword);
        }
    };
    const handleKeyDown = (e) => {
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
//# sourceMappingURL=useListSearchBar.js.map