import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

// Prismaクライアントをグローバルに保持（開発環境での重複インスタンス作成を防ぐ）
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// TODOリストの取得
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log("No valid session found");
      return NextResponse.json([], { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      console.log("Invalid user ID type:", session.user.id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(todos);

  } catch (error) {
    console.error('Todos API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// TODOの追加
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "無効なユーザーID" }, { status: 400 });
    }
    
    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log("ユーザーが見つかりません。ID:", userId);
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    const { text } = await request.json();
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json({ error: "テキストは必須です" }, { status: 400 });
    }
    
    const todo = await prisma.todo.create({
      data: {
        text,
        userId
      }
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Todo作成エラー:", error.message);
    return NextResponse.json(
      { error: "Todoの作成に失敗しました", details: error.message }, 
      { status: 500 }
    );
  }
}