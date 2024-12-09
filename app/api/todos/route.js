import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from '../../../lib/auth';

// Prismaクライアントをグローバルに保持
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export async function GET(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todos = await prisma.todo.findMany({
      where: { userId: user.id }
    });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/todos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    console.log("Received token:", token);

    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const user = verifyToken(token);
    console.log("Decoded user:", user);

    if (!user || typeof user.id !== 'number') {
      console.log("Invalid user data:", user);
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
      console.log("Request body:", body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json({ error: "Invalid JSON in request" }, { status: 400 });
    }

    if (!body || !body.text) {
      console.log("Invalid request body");
      return NextResponse.json({ error: "Todoのテキストが必要です" }, { status: 400 });
    }

    try {
      const userId = Number(user.id);
      
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: userId,
            email: `user${userId}@example.com`
          }
        });
      }

      const todoData = {
        text: body.text,
        userId: userId,
        done: false
      };
      console.log("Creating todo with data:", todoData);

      const todo = await prisma.todo.create({
        data: todoData,
        select: {
          id: true,
          text: true,
          done: true,
          userId: true
        }
      });
      console.log("Todo created:", todo);

      return NextResponse.json(todo, { status: 201 });
    } catch (dbError) {
      console.error("Database error details:", {
        name: dbError.name,
        message: dbError.message,
        code: dbError.code
      });
      return NextResponse.json(
        { error: "データベースエラー: " + dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General error in POST /api/todos:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== 'number' || typeof body.completed !== 'boolean') {
      return NextResponse.json({ error: "IDと完了状態が必要です" }, { status: 400 });
    }

    const todo = await prisma.todo.update({
      where: { id: body.id, userId: user.id },
      data: { done: body.completed },
    });

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/todos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    await prisma.todo.delete({
      where: { 
        id: parseInt(id),
        userId: user.id
      },
    });

    return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/todos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}