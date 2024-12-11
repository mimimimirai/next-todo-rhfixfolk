import { SessionProvider } from 'next-auth/react'
import Admin from '../components/layouts/Admin'
import Client from '../components/layouts/Client'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {Component.auth?.role === "admin" ? (
        <Admin>
          <Component {...pageProps} />
        </Admin>
      ) : (
        <Client>
          <Component {...pageProps} />
        </Client>
      )}
    </SessionProvider>
  )
}
