import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// メール確認後のコールバック処理
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    try {
      // Supabaseでメール確認コードを処理
      await supabase.auth.exchangeCodeForSession(code);
      
      // 確認成功後、ログインページにリダイレクト
      return NextResponse.redirect(new URL('/signin', request.url));
    } catch (error) {
      console.error('メール確認エラー:', error);
      // エラーページにリダイレクト
      return NextResponse.redirect(new URL('/auth/error?message=メール確認に失敗しました', request.url));
    }
  }
  
  // コードがない場合はホームページにリダイレクト
  return NextResponse.redirect(new URL('/', request.url));
} 