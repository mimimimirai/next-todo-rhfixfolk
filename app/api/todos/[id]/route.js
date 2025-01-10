import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'));

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'IDが無効です' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.completed !== 'boolean') {
      return NextResponse.json(
        { error: '完了状態は必須です' },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.findUnique({
      where: { id: id }
    });

    if (!todo) {
      return NextResponse.json(
        { error: '指定されたTodoが見つかりません' },
        { status: 404 }
      );
    }

    if (todo.userId !== userId) {
      console.log('権限チェック失敗:', { todoUserId: todo.userId, requestUserId: userId });
      return NextResponse.json(
        { error: 'このTodoを更新する権限がありません' },
        { status: 403 }
      );
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: id },
      data: { done: body.completed },
    });

    return NextResponse.json({ message: "Todoを更新しました", todo: updatedTodo }, { status: 200 });
  } catch (error) {
    console.error('Todoの更新エラー:', error);
    return NextResponse.json(
      { error: 'Todoの更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'));

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'IDが無効です' },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.findUnique({
      where: { id: id }
    });

    if (!todo) {
      return NextResponse.json(
        { error: '指定されたTodoが見つかりません' },
        { status: 404 }
      );
    }

    if (todo.userId !== userId) {
      console.log('権限チェック失敗:', { todoUserId: todo.userId, requestUserId: userId });
      return NextResponse.json(
        { error: 'このTodoを削除する権限がありません' },
        { status: 403 }
      );
    }

    await prisma.todo.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Todoを削除しました" }, { status: 200 });
  } catch (error) {
    console.error('Todoの削除エラー:', error);
    return NextResponse.json(
      { error: 'Todoの削除に失敗しました' },
      { status: 500 }
    );
  }
} 