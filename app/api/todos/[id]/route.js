import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

// TODOの更新（完了状態の切り替え）
export async function PATCH(request, { params }) {
  try {
    // Supabaseセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
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
    const { data: todo, error: fetchError } = await supabase
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
    const { data: updatedTodo, error: updateError } = await supabase
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
    // Supabaseセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    const id = params.id;
    
    // TODOの存在確認と権限チェック
    const { data: todo, error: fetchError } = await supabase
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
    const { error: deleteError } = await supabase
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