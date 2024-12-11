'use client'

import { useSession } from "next-auth/react"
import { SignInButton, SignOutButton } from './AuthButtons'

export default function SessionCheck() {
  const { data: session, status } = useSession()
  
  if (status === "authenticated") {
    return (
      <div>
        <div>Signed in as {session.user.email}</div>
        <SignOutButton />
      </div>
    )
  }

  return (
    <div>
      <SignInButton />
      <SignInButton provider="github" />
      <SignInButton provider="email" email="user@example.com" />
    </div>
  )
} 