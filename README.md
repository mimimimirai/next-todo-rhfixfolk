# Next.js Todo App

シンプルで使いやすいTodoリスト管理アプリケーションです。Next.jsとSupabaseを使用して構築されています。

## 機能

- **ユーザー認証**
  - アカウント登録
  - ログイン/ログアウト
  - セッション管理

- **アカウント管理**
  - ユーザー情報の表示
  - ユーザー情報の更新（メールアドレス）

- **Todo管理**
  - Todoの追加
  - Todoの削除
  - Todoの完了/未完了の切り替え
  - Todoのフィルタリング（すべて/未完了/完了済み）

## ディレクトリ構成

- `app/` - アプリケーションのメインコード
  - `(auth)/` - 認証関連のページ
  - `api/` - APIエンドポイント
    - `todos/` - Todo管理API
  - `components/` - 再利用可能なコンポーネント
  - `providers.jsx` - 認証プロバイダー
- `lib/` - ユーティリティと共通機能
  - `supabase.js` - Supabaseクライアント設定

## 技術スタック

- Next.js 15
- React
- Supabase (認証・データベース)
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
│   ├── api/
│   │   └── todos/
│   │       ├── route.js
│   │       └── [id]/
│   │           └── route.js
│   │
│   ├── components/
│   │   ├── CalendarSidebar.jsx
│   │   ├── CalendarSidebar.module.css
│   │   ├── Header.jsx
│   │   ├── Header.module.css
│   │   ├── TodoApp.jsx
│   │   └── TodoApp.module.css
│   │
│   ├── globals.css
│   ├── layout.jsx
│   ├── page.jsx
│   └── providers.jsx
│
├── lib/
│   └── supabase.js
│
├── .env
├── package.json
└── next.config.js