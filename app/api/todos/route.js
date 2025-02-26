import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

// Prismaクライアントをグローバルに保持
const prisma = new PrismaClient();

// TODOリストの取得
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const todos = await prisma.todo.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error("TODOの取得に失敗しました:", error);
    return NextResponse.json({ error: "TODOの取得に失敗しました" }, { status: 500 });
  }
}

// TODOの追加（簡略版）
export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: "テキストは必須です" }, { status: 400 });
    }
    
    // 仮のTODOを返す（データベース操作なし）
    const mockTodo = {
      id: Date.now(),
      text: text.trim(),
      done: false,
      userId: 1, // 仮のユーザーID
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockTodo);
  } catch (error) {
    console.error("TODOの追加に失敗しました:", error);
    return NextResponse.json({ error: "TODOの追加に失敗しました" }, { status: 500 });
  }
}