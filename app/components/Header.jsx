"use client";

import { useSession, signOut } from "next-auth/react";
import styles from "./Header.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

export default function Header() {
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <button 
              className={styles.menuButton}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="メニューを開く"
            >
              <FaBars />
            </button>
            
            {status === 'authenticated' ? (
              <Link href="/" className={styles.logo}>
                Todo App
              </Link>
            ) : (
              <Link href="/" className={styles.logo}>
                Todo App
              </Link>
            )}
          </div>
          
          <div className={styles.userInfo}>
            {status === 'authenticated' && userName}
          </div>
          
          <div className={styles.rightSection}>
            {status === 'authenticated' ? (
              <button onClick={() => signOut({ callbackUrl: '/signin' })} className={styles.logoutButton}>
                ログアウト
              </button>
            ) : (
              <Link href="/signin" className={styles.loginButton}>
                ログイン
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
} 