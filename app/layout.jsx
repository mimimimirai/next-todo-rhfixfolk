import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './providers';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Todo App',
  description: 'Todoアプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <div className="flex relative pt-28">
            <main className="flex-1 p-4">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}