# pbl5_fe_shared-logic

[![English](https://img.shields.io/badge/Language-English-blue)](./README.md) [![日本語](https://img.shields.io/badge/Language-%E6%97%A5%E6%9C%AC%E8%AA%9E-red)](#)

このリポジトリには、Zentaku プラットフォームの **共有ロジック (Shared Logic)** モジュールが含まれています。異なるフロントエンドアプリケーション（Webおよびモバイル）間で共有される共通の状態、モデル、API統合、および検証スキーマを提供します。

---

## 🌐 プロジェクトエコシステム

Zentaku は3つの主要なリポジトリに分かれた完全なシステムです：

1. **[Zentaku_BE (バックエンド)](https://github.com/itsdoanguen/Zentaku)** - コアAPIサービス。
2. **[pbl5_webFE (Webフロントエンド)](https://github.com/UmaMusumeEnjoyer/Zentaku)** - ユーザー向けのWebインターフェース。
3. **[shared-logic (共有ライブラリ)](https://github.com/UmaMusumeEnjoyer/pbl5_fe_shared-logic)** - *現在位置！*
4. **[FilmServer (HLS トランスコーダ)](#)** - ローカルのHLSストリーミングおよびビデオ変換サービス。

---

## 🛠 技術スタック

- **言語:** TypeScript
- **状態管理:** Zustand
- **データフェッチ:** Axios
- **リアルタイム通信:** Socket.IO Client
- **バリデーション:** Zod
- **ビルドツール:** TypeScript (tsc)

---

## ✨ 主な機能

- **一元化された状態管理:** グローバル状態（ユーザー認証、設定）のための共有 Zustand ストア。
- **API インターフェース:** 事前設定された Axios インスタンスと API エンドポイントの定義。
- **データ検証:** Webおよびモバイル間で一貫したデータ構造を保証するための Zod スキーマ。
- **WebSocket クライアント:** リアルタイム機能向けの設定済み Socket.IO クライアント。
- **クロスプラットフォーム:** **React.js** (Web) および **React Native** (モバイル) の両方でシームレスに動作するように設計されています。

---

## 🚀 インストールとセットアップ

### 前提条件
- Node.js
- React および React-Native は `peerDependencies` としてリストされています。

### 手順

1. **リポジトリのクローン:**
   ```bash
   git clone https://github.com/UmaMusumeEnjoyer/pbl5_fe_shared-logic.git
   cd pbl5_fe_shared-logic
   ```

2. **依存関係のインストール:**
   ```bash
   npm install
   ```

3. **ライブラリのビルド:**
   ```bash
   npm run build
   ```
   これにより、TypeScript ファイルが `dist/` ディレクトリにコンパイルされます。

4. **ローカルテスト (オプション):**
   公開せずに `pbl5_webFE` で変更をローカルにテストしたい場合:
   ```bash
   npm link
   # その後、pbl5_webFE フォルダに移動して以下を実行します：
   # npm link @umamusumeenjoyer/shared-logic
   ```

---

## 📁 フォルダ構成

```text
src/
├── api/            # Axios設定とAPI呼び出し
├── models/         # TypeScriptインターフェースと型
├── schemas/        # Zod検証スキーマ
├── sockets/        # Socket.IOクライアントロジック
├── stores/         # Zustand状態管理
└── index.ts        # メインエクスポートエントリーポイント
```

---

## 📸 デモと使用例

> **開発者へのメモ:** ここにコードスニペットや、フロントエンドプロジェクトでこのライブラリがどのようにインポートされるかのスクリーンショットを提供できます。画像は `docs/images/` 内に配置してください。

```typescript
// pbl5_webFE での使用例
import { useAuthStore, userSchema } from '@umamusumeenjoyer/shared-logic';

const { user, login } = useAuthStore();
// 検証
const result = userSchema.safeParse(userData);
```

---

## 📄 ライセンス

このプロジェクトは ISC ライセンスの下でライセンスされています。
