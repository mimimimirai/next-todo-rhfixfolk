# Next.js Todo App

シンプルで使いやすいTodoリスト管理アプリケーションです。Next.js、NextAuth.js、Prismaを使用して構築されています。

## 機能

- **ユーザー認証**
  - アカウント登録
  - ログイン/ログアウト
  - セッション管理

- **アカウント管理**
  - ユーザー情報の表示
  - ユーザー情報の更新（名前、メールアドレス）

- **Todo管理**
  - Todoの追加
  - Todoの削除
  - Todoの完了/未完了の切り替え
  - Todoのフィルタリング（すべて/未完了/完了済み）

## ディレクトリ構成

- `app/` - アプリケーションのメインコード
  - `(auth)/` - 認証関連のページ
  - `account/` - アカウント管理機能
  - `components/` - 再利用可能なコンポーネント
  - `api/` - APIエンドポイント
- `lib/` - ユーティリティと共通機能
- `prisma/` - データベーススキーマ

## 技術スタック

- Next.js 14
- React
- Prisma (ORM)
- NextAuth.js (認証)
- CSS Modules (スタイリング)

next-todo-rhfixfolk/
├── app/
│   ├── (auth)/
│   │   ├── auth.module.css
│   │   ├── signin/
│   │   │   └── page.jsx
│   │   └── signup/
│   │       └── page.jsx
│   │
│   ├── account/
│   │   ├── account.module.css
│   │   ├── actions.js
│   │   └── page.jsx
│   │
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.js
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.module.css
│   │   ├── TodoApp.jsx
│   │   └── TodoApp.module.css
│   │
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── package.json
└── next.config.js