import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // 既存ユーザーのチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このユーザー名は既に使用されています" },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email: username,
        password: hashedPassword
      }
    });

    return NextResponse.json({ message: "ユーザーが作成されました" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "ユーザー登録に失敗しました" },
      { status: 500 }
    );
  }
} 