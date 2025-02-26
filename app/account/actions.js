"use server"

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

// アカウント作成
export async function createAccount({ name, email, password }) {
  try {
    if (!email || !password) {
      return { success: false, error: "必須項目が入力されていません" }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, error: "このメールアドレスは既に登録されています" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error("Account creation error:", error)
    return { success: false, error: "アカウントの作成に失敗しました" }
  }
}

// アカウント更新
export async function updateAccount({ name, email }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "認証が必要です" };
    }

    // 現在のユーザー情報を取得
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!currentUser) {
      return { success: false, error: "ユーザーが見つかりません" };
    }

    console.log("現在のユーザー情報:", currentUser); // デバッグ用

    // アカウント更新
    const updateData = {
      name,
      ...(email !== currentUser.email ? { email } : {})
    };

    console.log("更新データ:", updateData);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Account update error:", error);
    return { success: false, error: "アカウントの更新に失敗しました: " + error.message };
  }
} 