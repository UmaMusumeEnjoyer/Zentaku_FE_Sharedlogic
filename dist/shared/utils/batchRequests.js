var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// shared-logic/src/utils/batchRequests.ts
export function batchWithLimit(items_1, fn_1) {
    return __awaiter(this, arguments, void 0, function* (items, fn, limit = 10) {
        const results = [];
        for (let i = 0; i < items.length; i += limit) {
            const batch = items.slice(i, i + limit);
            const batchResults = yield Promise.all(batch.map(fn));
            results.push(...batchResults);
        }
        return results;
    });
}
//# sourceMappingURL=batchRequests.js.map