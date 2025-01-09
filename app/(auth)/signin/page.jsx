'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './signin.module.css'

export default function SignIn() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  useEffect(() => {
    console.log('Current cookies:', document.cookie)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      try {
        console.log('Login attempt:', { username, password });
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false
        });
        console.log('Login result:', result);

        if (result?.error) {
          console.error('Login error:', result.error);
          setError(result.error);
        } else if (result?.ok) {
          console.log('Login successful, redirecting...');
          window.location.replace('/');
        }
      } catch (error) {
        console.error('Login exception:', error);
        setError("ログインに失敗しました");
      }
    } else {
      setIsRegistering(true)
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        setRegistrationSuccess(true)
        
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false
        });

        if (result?.ok) {
          window.location.replace('/');
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setIsRegistering(false)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>TodoApp</h1>
        <h2 className={styles.subtitle}>{isLogin ? 'ログイン' : '新規登録'}</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        {registrationSuccess && (
          <div className={styles.success}>
            登録が完了しました！ログインページに移動します...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            className={styles.input}
            disabled={isRegistering}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className={styles.input}
            disabled={isRegistering}
          />
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isRegistering}
          >
            {isRegistering ? '登録中...' : isLogin ? 'ログイン' : '登録'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className={styles.switchButton}
          disabled={isRegistering}
        >
          {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
        </button>
      </div>
    </div>
  )
} 