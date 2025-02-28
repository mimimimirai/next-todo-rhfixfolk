"use server"

import { supabase } from "@/lib/supabase"

// アカウント作成
export async function createAccount({ name, email, password }) {
  try {
    if (!email || !password) {
      return { success: false, error: "必須項目が入力されていません" }
    }

    // 有効なメールアドレスかチェック - 正規表現を少し緩めに設定
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "有効なメールアドレス形式を入力してください" };
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      return { success: false, error: "パスワードは6文字以上である必要があります" };
    }

    // Supabaseでユーザーを作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        },
        // リダイレクトURLを設定（メール確認後のリダイレクト先）
        emailRedirectTo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/callback`,
      }
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      
      // エラーメッセージをより具体的に
      if (authError.message.includes("email")) {
        return { success: false, error: "このメールアドレスは使用できないか、すでに登録されています" };
      } else if (authError.message.includes("password")) {
        return { success: false, error: "パスワードが要件を満たしていません（8文字以上、大文字小文字を含む等）" };
      }
      
      return { success: false, error: authError.message };
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Account creation error:", error)
    return { success: false, error: "アカウントの作成に失敗しました: " + error.message }
  }
}

// アカウント更新
export async function updateAccount({ name, email, avatar_url }) {
  try {
    console.log("Server: updateAccount called with", { name, email, avatar_url });
    
    // Supabaseセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("Server: No session found");
      return { success: false, error: "認証が必要です" };
    }

    console.log("Server: Session found for user", session.user.id);
    const userId = session.user.id;
    const currentEmail = session.user.email;

    // ユーザーデータを更新
    const updateData = {};
    
    if (name || avatar_url) {
      updateData.data = {};
      
      if (name) {
        updateData.data.name = name;
      }
      
      if (avatar_url) {
        updateData.data.avatar_url = avatar_url;
        console.log("Server: Setting avatar_url to", avatar_url);
      }
    }
    
    if (email && email !== currentEmail) {
      updateData.email = email;
    }

    console.log("Server: Update data prepared", updateData);
    
    if (Object.keys(updateData).length > 0) {
      console.log("Server: Calling supabase.auth.updateUser");
      
      // クライアント側で更新する方法に変更
      return { 
        success: true, 
        updateData,
        message: "クライアント側で更新してください" 
      };
    }
    
    return { success: true, user: session.user };
  } catch (error) {
    console.error("Server: Account update error:", error);
    return { success: false, error: "アカウントの更新に失敗しました: " + error.message };
  }
} 