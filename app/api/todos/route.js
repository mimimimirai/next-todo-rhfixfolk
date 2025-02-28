import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// TODOリストの取得
export async function GET() {
  try {
    // Supabaseセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.log("No valid session found");
      return NextResponse.json([], { status: 401 });
    }

    const userId = session.user.id;

    // Supabaseからtodosを取得
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json(todos);

  } catch (error) {
    console.error('Todos API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// TODOの追加
export async function POST(request) {
  try {
    // Supabaseセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userId = session.user.id;
    
    const { title } = await request.json();
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
    }
    
    // Supabaseにtodoを追加
    const { data: todo, error } = await supabase
      .from('todos')
      .insert([
        { title, user_id: userId, completed: false }
      ])
      .select()
      .single();

    if (error) {
      console.error("Todo作成エラー:", error);
      return NextResponse.json(
        { error: "Todoの作成に失敗しました", details: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Todo作成エラー:", error.message);
    return NextResponse.json(
      { error: "Todoの作成に失敗しました", details: error.message }, 
      { status: 500 }
    );
  }
}