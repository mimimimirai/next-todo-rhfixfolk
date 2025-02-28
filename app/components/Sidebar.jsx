"use client";

import Link from "next/link";
import { useAuth } from "../providers";
import styles from "./Sidebar.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function Sidebar({ isOpen, onClose }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // ESCキーでサイドバーを閉じる
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.push('/signin');
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
        <FaTimes />
      </button>
      
      <div className={styles.sidebarContent}>
        <h2 className={styles.sidebarTitle}>MENU</h2>
        
        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <Link href="/" onClick={onClose}>
                Todoリスト
              </Link>
            </li>
            
            {user && (
              <li>
                <Link href="/account" onClick={onClose}>
                  アカウント設定
                </Link>
              </li>
            )}
            
            {user ? (
              <li>
                <button 
                  className={styles.signOutButton}
                  onClick={handleSignOut}
                >
                  ログアウト
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/signin" onClick={onClose}>
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link href="/signup" onClick={onClose}>
                    新規登録
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        {user && (
          <div className={styles.userInfo}>
            <p>ログイン中: {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
} 