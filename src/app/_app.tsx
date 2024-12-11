import React from 'react'
import type { AppProps } from 'next/app'
import { Session } from 'next-auth'
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
      children={<Component {...pageProps} />}
    >
    </SessionProvider>
  )
} 