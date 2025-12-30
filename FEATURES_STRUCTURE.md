# Cấu trúc Features trong shared-logic

## 📁 Cấu trúc tổng quan

```
src/
├── features/                    # Logic theo từng feature/page
│   └── home/                   # Feature HomePage
│       ├── hooks/              # Custom hooks cho home
│       │   └── useHomeLogic.ts
│       ├── constants/          # Constants cho home
│       │   └── homeConstants.ts
│       ├── types/              # Types/Interfaces cho home
│       │   └── home.types.ts
│       └── index.ts            # Export tất cả
│
├── services/                   # API services (dùng chung)
├── shared/                     # Shared logic, utils, components
└── api/                        # API configuration
```

## 🎯 Quy tắc tổ chức

### 1. Features Structure
Mỗi feature/page có cấu trúc riêng:
```
features/[feature-name]/
├── hooks/          # Custom hooks đặc trưng cho feature này
├── constants/      # Constants chỉ dùng trong feature này
├── types/          # Types/Interfaces riêng của feature
└── index.ts        # Export tất cả để dễ import
```

### 2. Khi nào tạo feature mới?
- Mỗi **page** trong app nên có một **feature** tương ứng
- Ví dụ: `AnimeDetailPage` → `features/anime-detail/`

### 3. Mapping từ myanilist_front
```
myanilist_front/pages/          →  shared-logic/src/features/
├── HomePage/                   →  home/
├── AnimeDetailPage/            →  anime-detail/
├── AnimeListPage/              →  anime-list/
├── AnimeSearchPage/            →  anime-search/
├── ProfilePage/                →  profile/
├── CharacterPage/              →  character/
├── CalendarPage/               →  calendar/
├── AuthPage/                   →  auth/
└── NewsDetailPage/             →  news/
```

## 📝 Hướng dẫn thêm feature mới

### Bước 1: Tạo cấu trúc thư mục
```bash
mkdir -p src/features/[feature-name]/{hooks,constants,types}
```

### Bước 2: Tạo các file cần thiết

**types/[feature].types.ts:**
```typescript
// Định nghĩa interfaces/types cho feature
export interface SomeData {
  id: number;
  name: string;
}
```

**constants/[feature]Constants.ts:**
```typescript
// Constants và mock data
import { SomeData } from '../types/[feature].types';

export const MOCK_DATA: SomeData[] = [...];
```

**hooks/use[Feature]Logic.ts:**
```typescript
// Business logic của feature
import { useState, useEffect } from 'react';
import { MOCK_DATA } from '../constants/[feature]Constants';
import { SomeData } from '../types/[feature].types';

export const use[Feature]Logic = () => {
  const [data, setData] = useState<SomeData[]>([]);
  // ... logic
  return { data };
};
```

**index.ts:**
```typescript
// Export tất cả
export * from './hooks/use[Feature]Logic';
export * from './types/[feature].types';
export * from './constants/[feature]Constants';
```

### Bước 3: Thêm vào src/index.ts
```typescript
export * from './features/[feature-name]';
```

## 🔍 Cách import trong project

### Từ pbl5_webFE (TypeScript):
```typescript
import { useHomeLogic, AnimeItem, TRENDING_ANIME_MOCK } from 'shared-logic';
```

### Từ myanilist_front (JavaScript):
```javascript
import { useHomeLogic, TRENDING_ANIME_MOCK } from 'shared-logic';
```

## 📌 Best Practices

1. **Mỗi feature độc lập:** Không import giữa các features
2. **Dùng services chung:** API calls nên qua `services/`
3. **Types rõ ràng:** Luôn định nghĩa types/interfaces
4. **Export thông qua index.ts:** Giúp import gọn gàng
5. **Constants tách biệt:** Mock data và constants riêng file

## 🚀 Lợi ích của cấu trúc này

✅ **Dễ tìm kiếm:** Biết ngay logic của page nào nằm ở đâu  
✅ **Dễ migrate:** Copy từng page từ project cũ sang  
✅ **Dễ maintain:** Mỗi feature tự quản lý logic của mình  
✅ **Dễ scale:** Thêm feature mới không ảnh hưởng code cũ  
✅ **Reusable:** Logic trong features có thể dùng lại

## 🔄 Khi migrate page mới

1. Xác định page cần migrate từ `myanilist_front`
2. Tạo feature tương ứng trong `shared-logic/src/features/`
3. Copy logic từ page cũ vào hooks/
4. Tách types ra file riêng
5. Tách constants/mock data ra file riêng
6. Tạo index.ts để export
7. Update src/index.ts chính
8. Test import trong pbl5_webFE
