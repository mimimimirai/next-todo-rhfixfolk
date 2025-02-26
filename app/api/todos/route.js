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
      orderBy: { id: 'desc' }
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

    // ユーザーIDの型を確認するためのログを追加
    console.log("セッションから取得したユーザーID:", session.user.id, "型:", typeof session.user.id);
    
    // 型変換を行わずにそのまま使用してみる
    const userId = session.user.id;
    
    // ユーザーの存在確認を追加
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log("ユーザーが見つかりません。ID:", userId);
      return new Response(JSON.stringify({ error: "ユーザーが見つかりません" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("ユーザーが見つかりました:", user);

    const { text } = await request.json();
    
    // 作成するTODOのデータをログに出力
    console.log("作成するTODOデータ:", { text, userId });
    
    const todo = await prisma.todo.create({
      data: {
        text,
        userId
      }
    });

    return new Response(JSON.stringify(todo), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // エラーの詳細情報を出力
    console.error("Todo作成エラー:", error.message);
    console.error("エラースタック:", error.stack);
    return new Response(JSON.stringify({ error: "Todoの作成に失敗しました", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}