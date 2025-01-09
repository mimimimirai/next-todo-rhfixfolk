'use client'

import { useSession } from 'next-auth/react'
import TodoApp from './components/TodoApp'
import SignIn from './(auth)/signin/page'

export default function Page() {
  const { data: session, status } = useSession()
  console.log('Session status:', status);
  console.log('Session data:', session);

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <SignIn />
  }

  return <TodoApp />
}