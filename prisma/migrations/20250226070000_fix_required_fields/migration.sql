-- SQLiteではテーブルの再作成が必要です
PRAGMA foreign_keys=OFF;

-- 一時テーブルの作成
CREATE TABLE "Todo_new" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "text" TEXT NOT NULL,
  "done" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" DATETIME NOT NULL,
  "userId" INTEGER NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 既存データの移行（updatedAtに値を設定）
INSERT INTO "Todo_new" ("id", "text", "done", "userId", "updatedAt")
SELECT "id", "text", "done", "userId", CURRENT_TIMESTAMP
FROM "Todo";

-- 古いテーブルを削除
DROP TABLE "Todo";

-- 新しいテーブルをリネーム
ALTER TABLE "Todo_new" RENAME TO "Todo";

-- Userテーブルも同様に更新
CREATE TABLE "User_new" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "updatedAt" DATETIME NOT NULL
);

-- 既存データの移行
INSERT INTO "User_new" ("id", "email", "password", "name", "updatedAt")
SELECT "id", "email", "password", "name", CURRENT_TIMESTAMP
FROM "User";

-- 古いテーブルを削除
DROP TABLE "User";

-- 新しいテーブルをリネーム
ALTER TABLE "User_new" RENAME TO "User";

-- インデックスの再作成
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

PRAGMA foreign_keys=ON; 