"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";
import { useEffect } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const { data: session, status } = useSession();
  
  // ESCキーでサイドバーを閉じる
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    // サイドバーが開いているときは背景スクロールを無効化
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // サイドバー外クリックで閉じる
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
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
                  
                  {status === 'authenticated' && (
                    <li>
                      <Link href="/account" onClick={onClose}>
                        アカウント設定
                      </Link>
                    </li>
                  )}
                  
                  {status === 'authenticated' ? (
                    <li>
                      <button 
                        className={styles.signOutButton}
                        onClick={() => {
                          onClose();
                          signOut({ callbackUrl: '/signin' });
                        }}
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
              
              {status === 'authenticated' && (
                <div className={styles.userInfo}>
                  <p>ログイン中: {session.user.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 