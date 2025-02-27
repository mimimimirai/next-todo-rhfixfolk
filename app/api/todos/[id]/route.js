import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

// Prismaクライアントをシングルトンとして管理
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// TODOの更新（完了状態の切り替え）
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    // ユーザーIDを数値に変換
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "無効なユーザーID" }, { status: 400 });
    }
    
    // パスパラメータからTODO IDを取得
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なTODO ID" }, { status: 400 });
    }
    
    const { done } = await request.json();
    if (typeof done !== 'boolean') {
      return NextResponse.json({ error: "完了状態は必須です" }, { status: 400 });
    }
    
    // TODOの存在確認
    const todo = await prisma.todo.findUnique({
      where: { id }
    });
    
    if (!todo) {
      return NextResponse.json({ error: "指定されたTODOが見つかりません" }, { status: 404 });
    }
    
    // 権限チェック
    if (todo.userId !== userId) {
      return NextResponse.json({ error: "このTODOを更新する権限がありません" }, { status: 403 });
    }
    
    // TODOの更新
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { done }
    });
    
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("TODOの更新に失敗しました:", error);
    return NextResponse.json({ error: "TODOの更新に失敗しました" }, { status: 500 });
  }
}

// TODOの削除
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "無効なユーザーID" }, { status: 400 });
    }
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "無効なTODO ID" }, { status: 400 });
    }
    
    // TODOの存在確認
    const todo = await prisma.todo.findUnique({
      where: { id }
    });
    
    if (!todo) {
      return NextResponse.json({ error: "指定されたTODOが見つかりません" }, { status: 404 });
    }
    
    // 権限チェック
    if (todo.userId !== userId) {
      return NextResponse.json({ error: "このTODOを削除する権限がありません" }, { status: 403 });
    }
    
    // TODOの削除
    await prisma.todo.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: "TODOを削除しました" });
  } catch (error) {
    console.error("TODOの削除に失敗しました:", error);
    return NextResponse.json({ error: "TODOの削除に失敗しました" }, { status: 500 });
  }
} 