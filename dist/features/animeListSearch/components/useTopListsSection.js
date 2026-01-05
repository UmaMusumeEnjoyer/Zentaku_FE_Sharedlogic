export const useTopListsSection = (lists) => {
    // Logic kiểm tra đơn giản để quyết định có render hay không
    const hasLists = Array.isArray(lists) && lists.length > 0;
    return {
        hasLists
    };
};
//# sourceMappingURL=useTopListsSection.js.map