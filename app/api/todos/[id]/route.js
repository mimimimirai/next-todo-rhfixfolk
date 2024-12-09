import { NextResponse } from "next/server";
import prisma from "@/app/util/db";
import { verifyToken } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const decoded = verifyToken(token);
    
    const id = params.id;
    
    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId: decoded.userId
      },
    });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 