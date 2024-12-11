'use client'

import { useEffect, useState } from 'react'
import { getProviders, signIn } from 'next-auth/react'
import LoginForm from '../../components/LoginForm'

export default function SignIn() {
  const [providers, setProviders] = useState(null)

  useEffect(() => {
    async function loadProviders() {
      const providers = await getProviders()
      setProviders(providers)
    }
    loadProviders()
  }, [])

  if (!providers) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>ログイン</h1>
      <LoginForm />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
} 