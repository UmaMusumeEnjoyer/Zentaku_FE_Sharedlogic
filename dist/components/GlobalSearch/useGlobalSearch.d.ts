import { SearchResultUser } from './GlobalSearch.types';
export declare const useGlobalSearch: (isOpen: boolean, onClose: () => void, onUserSelect: (username: string) => void) => {
    searchTerm: string;
    results: SearchResultUser[];
    loading: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleUserClick: (username: string) => void;
};
//# sourceMappingURL=useGlobalSearch.d.ts.map