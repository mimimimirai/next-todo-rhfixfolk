import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TODOの更新（完了状態の切り替え）
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "認証が必要です" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // ユーザーIDを数値に変換
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: "無効なユーザーID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // パスパラメータからTODO IDを取得
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "無効なTODO ID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const { done } = await request.json();
    if (typeof done !== 'boolean') {
      return new Response(JSON.stringify({ error: "完了状態は必須です" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // TODOの存在確認
    const todo = await prisma.todo.findUnique({
      where: { id }
    });
    
    if (!todo) {
      return new Response(JSON.stringify({ error: "指定されたTODOが見つかりません" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 権限チェック
    if (todo.userId !== userId) {
      return new Response(JSON.stringify({ error: "このTODOを更新する権限がありません" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // TODOの更新
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { done }
    });
    
    return new Response(JSON.stringify(updatedTodo), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("TODOの更新に失敗しました:", error);
    return new Response(JSON.stringify({ error: "TODOの更新に失敗しました" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// TODOの削除
export async function DELETE(request, { params }) {
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
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "無効なTODO ID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // TODOの存在確認
    const todo = await prisma.todo.findUnique({
      where: { id }
    });
    
    if (!todo) {
      return new Response(JSON.stringify({ error: "指定されたTODOが見つかりません" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 権限チェック
    if (todo.userId !== userId) {
      return new Response(JSON.stringify({ error: "このTODOを削除する権限がありません" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // TODOの削除
    await prisma.todo.delete({
      where: { id }
    });
    
    return new Response(JSON.stringify({ message: "TODOを削除しました" }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("TODOの削除に失敗しました:", error);
    return new Response(JSON.stringify({ error: "TODOの削除に失敗しました" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 