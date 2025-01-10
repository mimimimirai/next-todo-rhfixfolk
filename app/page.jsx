import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import TodoApp from "./components/TodoApp";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/signin");
  }

  // ユーザーのTodosを取得
  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      id: 'desc'
    }
  });

  return (
    <main>
      <TodoApp initialTodos={todos} userId={session.user.id} />
    </main>
  );
}
