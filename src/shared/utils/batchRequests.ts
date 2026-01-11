// shared-logic/src/utils/batchRequests.ts
export async function batchWithLimit<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  
  return results;
}