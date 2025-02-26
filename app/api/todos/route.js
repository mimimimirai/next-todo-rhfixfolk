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
      return new Response(JSON.stringify([]), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      console.log("Invalid user ID type:", session.user.id);
      return new Response(JSON.stringify({ error: "Invalid user ID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify(todos), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Todos API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// TODOの追加
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "認証が必要です" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: "無効なユーザーID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return new Response(JSON.stringify({ error: "テキストは必須です" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const newTodo = await prisma.todo.create({
      data: {
        text: text.trim(),
        done: false,
        userId
      }
    });
    
    return new Response(JSON.stringify(newTodo), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("TODOの追加に失敗しました:", error);
    return new Response(JSON.stringify({ error: "TODOの追加に失敗しました" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}