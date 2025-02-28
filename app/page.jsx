'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TodoApp from './components/TodoApp';
import CalendarSidebar from './components/CalendarSidebar';
import { useAuth } from './providers';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!user) {
    return null; // useEffectでリダイレクトするため
  }

  return (
    <main style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: '1' }}>
        <TodoApp />
      </div>
      <div style={{ width: '300px' }}>
        <CalendarSidebar />
      </div>
    </main>
  );
}
