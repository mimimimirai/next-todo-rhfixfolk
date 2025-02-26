"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumbs.module.css";
import { FaHome } from "react-icons/fa";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // パスを分割してパンくずリストの項目を作成
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // パスセグメントからパンくずリストの項目を生成
  const breadcrumbItems = [
    { label: <FaHome title="ホーム" />, path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      let label = segment;
      
      // パスセグメントに応じてラベルをカスタマイズ
      switch(segment) {
        case 'account':
          label = 'アカウント';
          break;
        case 'signin':
          label = 'ログイン';
          break;
        case 'signup':
          label = '新規登録';
          break;
        default:
          // セグメントの最初の文字を大文字に
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
      
      return { label, path };
    })
  ];

  return (
    <nav className={styles.breadcrumbs} aria-label="パンくずリスト">
      <ol>
        {breadcrumbItems.map((item, index) => (
          <li key={item.path}>
            {index < breadcrumbItems.length - 1 ? (
              <>
                <Link href={item.path} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
                <span className={styles.separator}>/</span>
              </>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 