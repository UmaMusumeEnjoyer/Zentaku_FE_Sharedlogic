import { KeyboardEvent } from 'react';
export declare const useListSearchBar: (onSearch?: (keyword: string) => void) => {
    keyword: string;
    setKeyword: import("react").Dispatch<import("react").SetStateAction<string>>;
    handleSearchAction: () => void;
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
};
//# sourceMappingURL=useListSearchBar.d.ts.map