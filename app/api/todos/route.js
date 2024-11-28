import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return Response.json(todos);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return Response.json(
        { error: "Todoのテキストが必要です" }, 
        { status: 400 }
      );
    }
    const todo = await prisma.todo.create({
      data: {
        text,
        done: false,
      },
    });
    return Response.json(todo, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
