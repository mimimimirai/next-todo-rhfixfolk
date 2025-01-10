import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Prismaクライアントをグローバルに保持
const prisma = new PrismaClient();

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId: userId
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Todoの取得エラー:', error);
    return NextResponse.json(
      { error: 'Todoの取得に失敗しました' },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    const body = await request.json();
    
    if (!body.text?.trim()) {
      return NextResponse.json(
        { error: 'テキストは必須です' },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { error: 'ユーザーIDは必須です' },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        text: body.text,
        userId: body.userId,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Todoの作成エラー:', error);
    return NextResponse.json(
      { error: 'Todoの作成に失敗しました' },
      { status: 500 }
    );
  }
};