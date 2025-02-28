// このファイルはSupabase認証に移行したため、使用されなくなりました。
// Supabase認証は以下のファイルで実装されています：
// - lib/supabase.js: Supabaseクライアントの設定
// - app/providers.jsx: 認証コンテキストプロバイダー

export async function POST() {
  return new Response(
    JSON.stringify({ message: "This endpoint is deprecated. Using Supabase authentication instead." }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
} 