"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers';
import styles from './Header.module.css';
import { FaUser, FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';

export default function Header() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // サイドバーの状態に応じてbodyクラスを切り替える
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    await signOut();
    router.push('/signin');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <button 
              className={styles.menuButton} 
              onClick={toggleSidebar}
              aria-label="メニューを開く"
            >
              <FaBars />
            </button>
            <Link href="/" className={styles.logo}>
              Todo App
            </Link>
            {user && (
              <div className={styles.userInfo}>
                <FaUser className={styles.userIcon} />
                <span className={styles.userName}>
                  {user.user_metadata?.name || user.email}
                </span>
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
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
} 