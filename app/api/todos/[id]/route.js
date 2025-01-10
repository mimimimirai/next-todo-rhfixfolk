import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'IDが無効です' },
        { status: 400 }
      );
    }

    await prisma.todo.delete({
      where: { 
        id: id,
        userId: userId
      },
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