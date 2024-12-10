import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from '../../../../lib/auth';

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

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.todo.delete({
      where: { 
        id: id,
        userId: user.id
      },
    });

    return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/todos/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 