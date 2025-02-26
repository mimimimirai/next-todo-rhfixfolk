import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './providers';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Todo App',
  description: 'Todoアプリケーション',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline';"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <div className="page-container">
            <Breadcrumbs />
            <main className="main-content">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}