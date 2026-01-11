import { ListRequest, ListMember, CategorizedRequests } from './requestList.types';
export declare const useRequestList: (requests?: ListRequest[], currentMembers?: ListMember[]) => {
    isExpanded: boolean;
    categorizedRequests: CategorizedRequests;
    totalCount: number;
    toggleExpanded: () => void;
    checkShowAccept: (req: ListRequest) => boolean;
    formatRequestDate: (dateString: string) => string;
};
//# sourceMappingURL=userequestList.d.ts.map