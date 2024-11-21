export default function RootLayout({ children }) {
    return (
      <html lang="ja">
        <body>
          <header>
            
          </header>
          {children}{/* ここで子コンポーネントを表示 */}
        </body>
      </html>
    );
  }