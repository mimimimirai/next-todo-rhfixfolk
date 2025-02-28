"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../(auth)/auth.module.css';

export default function AuthError() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || '認証中にエラーが発生しました';

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>認証エラー</h1>
        <p className={styles.errorMessage}>{errorMessage}</p>
        <div className={styles.authLinks}>
          <Link href="/signin" className={styles.authButton}>
            ログインページへ
          </Link>
          <Link href="/" className={styles.authLink}>
            ホームページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
} 