"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/signin');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            Todo App
          </Link>
          {user && (
            <div className={styles.userInfo}>
              {user.email}
            </div>
          )}
        </div>
        <div>
          {user ? (
            <>
              <Link href="/account" className={styles.accountButton}>
                アカウント
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                ログアウト
              </button>
            </>
          ) : (
            <Link href="/signin" className={styles.loginButton}>
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 