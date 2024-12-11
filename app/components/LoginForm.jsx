'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (result.error) {
        alert('ログインに失敗しました: ' + result.error)
      } else if (result.ok) {
        router.push(result.url || '/') // リダイレクト先URLがあればそこへ、なければホームへ
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('ログイン処理中にエラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
      />
      <button type="submit">ログイン</button>
    </form>
  )
} 