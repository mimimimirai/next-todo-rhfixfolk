'use client'

import { signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'

export function SignInButton({ provider, email, callbackUrl = '/' }) {
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      let result;
      if (provider === "credentials") {
        result = await signIn('credentials', {
          redirect: false,
          password: 'password' // 実際のパスワードはフォームから取得するべき
        })

        if (result.error) {
          alert(`認証エラー: ${result.error}`)
          return
        }

        if (result.ok) {
          router.push(result.url || callbackUrl)
        }
      } else if (provider === "email" && email) {
        signIn("email", { email, callbackUrl })
      } else if (provider) {
        signIn(provider, { callbackUrl })
      } else {
        signIn(undefined, { callbackUrl })
      }
    } catch (error) {
      console.error('SignIn error:', error)
      alert('サインイン処理中にエラーが発生しました')
    }
  }

  return (
    <button onClick={handleSignIn}>
      {provider ? `Sign in with ${provider}` : 'Sign in'}
    </button>
  )
}

export function SignOutButton({ callbackUrl = '/' }) {
  return (
    <button onClick={() => signOut({ callbackUrl })}>
      Sign out
    </button>
  )
} 