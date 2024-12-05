import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return new Response(JSON.stringify(todos), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET /api/todos:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.text) {
      return new NextResponse(
        JSON.stringify({ error: "Todoのテキストが必要です" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        text: body.text,
        done: false,
      },
    });

    return new NextResponse(JSON.stringify(todo), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Error in POST /api/todos:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => null);
    console.log("body" + body);
    if (!body || typeof body.id !== 'number' || typeof body.completed !== 'boolean') {
      return new NextResponse(
        JSON.stringify({ error: "IDと完了状態が必要です" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const todo = await prisma.todo.update({
      where: { id: body.id },
      data: { done: body.completed },
    });

    return new NextResponse(JSON.stringify(todo), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in PUT /api/todos:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log(request)
    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== 'number') {
      return NextResponse.json(
        { error: "IDが必要です" },
        { status: 400 }
      );
    }

    await prisma.todo.delete({
      where: { id: body.id }
    });

    return NextResponse.json(
      { message: "Todo deleted" },
      { status: 200
        }
    );
  } catch (error) {
    console.error("Error in DELETE /api/todos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}