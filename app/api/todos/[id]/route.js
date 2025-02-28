import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// サーバーサイドでSupabaseクライアントを初期化する関数
const getSupabaseServerClient = () => {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

// TODOの更新（完了状態の切り替え）
export async function PATCH(request, { params }) {
  try {
    // リクエストからAuthorizationヘッダーを取得
    const authHeader = request.headers.get('Authorization');
    
    // サーバーサイドでSupabaseクライアントを初期化
    const supabaseServer = getSupabaseServerClient();
    
    // セッションを取得
    const { data: { session } } = await supabaseServer.auth.getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // パスパラメータからTODO IDを取得
    const id = params.id;
    
    const { completed } = await request.json();
    if (typeof completed !== 'boolean') {
      return NextResponse.json({ error: "完了状態は必須です" }, { status: 400 });
    }
    
    // TODOの存在確認と権限チェック
    const { data: todo, error: fetchError } = await supabaseServer
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: "指定されたTODOが見つかりません" }, { status: 404 });
    }
    
    // 権限チェック
    if (todo.user_id !== userId) {
      return NextResponse.json({ error: "このTODOを更新する権限がありません" }, { status: 403 });
    }
    
    // TODOの更新
    const { data: updatedTodo, error: updateError } = await supabaseServer
      .from('todos')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error("TODOの更新に失敗しました:", updateError);
      return NextResponse.json({ error: "TODOの更新に失敗しました" }, { status: 500 });
    }
    
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("TODOの更新に失敗しました:", error);
    return NextResponse.json({ error: "TODOの更新に失敗しました" }, { status: 500 });
  }
}

// TODOの削除
export async function DELETE(request, { params }) {
  try {
    // リクエストからAuthorizationヘッダーを取得
    const authHeader = request.headers.get('Authorization');
    
    // サーバーサイドでSupabaseクライアントを初期化
    const supabaseServer = getSupabaseServerClient();
    
    // セッションを取得
    const { data: { session } } = await supabaseServer.auth.getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    const id = params.id;
    
    // TODOの存在確認と権限チェック
    const { data: todo, error: fetchError } = await supabaseServer
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: "指定されたTODOが見つかりません" }, { status: 404 });
    }
    
    // 権限チェック
    if (todo.user_id !== userId) {
      return NextResponse.json({ error: "このTODOを削除する権限がありません" }, { status: 403 });
    }
    
    // TODOの削除
    const { error: deleteError } = await supabaseServer
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error("TODOの削除に失敗しました:", deleteError);
      return NextResponse.json({ error: "TODOの削除に失敗しました" }, { status: 500 });
    }
    
    return NextResponse.json({ message: "TODOを削除しました" });
  } catch (error) {
    console.error("TODOの削除に失敗しました:", error);
    return NextResponse.json({ error: "TODOの削除に失敗しました" }, { status: 500 });
  }
} 