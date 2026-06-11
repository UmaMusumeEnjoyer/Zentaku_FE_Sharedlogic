# pbl5_fe_shared-logic

[![English](https://img.shields.io/badge/Language-English-blue)](#) [![日本語](https://img.shields.io/badge/Language-%E6%97%A5%E6%9C%AC%E8%AA%9E-red)](./README.ja.md)

This repository contains the **Shared Logic** module for the Zentaku platform. It provides common states, models, API integrations, and validation schemas that are shared across different frontend applications (Web and Mobile).

---

## 🌐 Project Ecosystem

Zentaku is a complete system divided into three main repositories:

1. **[Zentaku_BE (Backend)](https://github.com/itsdoanguen/Zentaku)** - The core API service.
2. **[pbl5_webFE (Web Frontend)](https://github.com/UmaMusumeEnjoyer/Zentaku)** - The user-facing web interface.
3. **[shared-logic (Shared Library)](https://github.com/UmaMusumeEnjoyer/pbl5_fe_shared-logic)** - *You are here!*
4. **[FilmServer (HLS Transcoder)](#)** - Local HLS Streaming and Video Conversion service.

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **State Management:** Zustand
- **Data Fetching:** Axios
- **Real-time:** Socket.IO Client
- **Validation:** Zod
- **Build Tool:** TypeScript (tsc)

---

## ✨ Key Features

- **Centralized State:** Shared Zustand stores for global states (User Auth, Settings).
- **API Interfaces:** Pre-configured Axios instances and API endpoint definitions.
- **Data Validation:** Zod schemas to ensure consistent data structures across Web and Mobile.
- **WebSocket Client:** Ready-to-use Socket.IO configurations for real-time features.
- **Cross-Platform:** Designed to work seamlessly with both **React.js** (Web) and **React Native** (Mobile).

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js
- Both React and React-Native are listed as `peerDependencies`.

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/UmaMusumeEnjoyer/pbl5_fe_shared-logic.git
   cd pbl5_fe_shared-logic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the library:**
   ```bash
   npm run build
   ```
   This compiles TypeScript files into the `dist/` directory.

4. **Local Testing (Optional):**
   If you want to test changes locally with `pbl5_webFE` without publishing:
   ```bash
   npm link
   # Then go to your pbl5_webFE folder and run:
   # npm link @umamusumeenjoyer/shared-logic
   ```

---

## 📁 Folder Structure

```text
src/
├── api/            # Axios setup and API calls
├── models/         # TypeScript interfaces and types
├── schemas/        # Zod validation schemas
├── sockets/        # Socket.IO client logic
├── stores/         # Zustand state management
└── index.ts        # Main export entry point
```

---

## 📸 Demo & Usage Example

> **Note to Developer:** You can provide a code snippet here or a screenshot of how this library is imported in the frontend projects. Place images inside `docs/images/`.

```typescript
// Example usage in pbl5_webFE
import { useAuthStore, userSchema } from '@umamusumeenjoyer/shared-logic';

const { user, login } = useAuthStore();
// validation
const result = userSchema.safeParse(userData);
```

---

## 📄 License

This project is licensed under the ISC License.
