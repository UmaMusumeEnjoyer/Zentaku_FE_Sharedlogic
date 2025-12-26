// src/utils/apiCache.js

const simpleCache = {};
const DEFAULT_TTL = 1000 * 60 * 20; // 20 phút

export const getCached = (key) => {
  const entry = simpleCache[key];
  if (!entry) return null;
  if (Date.now() > entry.exp) {
    delete simpleCache[key];
    return null;
  }
  return entry.val;
};

export const setCached = (key, val, ttl = DEFAULT_TTL) => {
  simpleCache[key] = { val, exp: Date.now() + ttl };
};

// Hàm xóa cache (cần khi logout)
export const clearCache = () => {
  for (const key in simpleCache) delete simpleCache[key];
};