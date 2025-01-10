"use client";

import { useSession, signOut } from "next-auth/react";
import styles from "./Header.module.css";

export default function Header() {
  const { data: session, status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.userInfo}>
          {session?.user?.email && (
            <span>ログイン中: {session.user.email}</span>
          )}
        </div>
        <button onClick={handleSignOut} className={styles.logoutButton}>
          ログアウト
        </button>
      </div>
    </header>
  );
} 