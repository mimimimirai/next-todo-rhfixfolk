"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../providers";
import { createAccount } from "../../account/actions";
import styles from "../auth.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 基本的なバリデーション
      if (!email || !password) {
        throw new Error("メールアドレスとパスワードは必須です");
      }

      // パスワードの長さチェック
      if (password.length < 6) {
        throw new Error("パスワードは6文字以上である必要があります");
      }

      // 1. サーバーアクションでアカウント作成（名前も保存）
      const result = await createAccount({ name, email, password });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // 2. サインアップ成功後の処理
      try {
        // 自動ログインを試みる
        const { error: signInError } = await signIn(email, password);
        
        
        // メール確認が必要な場合でも、ホームページにリダイレクト
        router.push('/');
      } catch (signInError) {
        // エラーが発生した場合は、ログインページにリダイレクト
        console.error("ログインエラー:", signInError);
        router.push('/signin');
      }
    } catch (error) {
      console.error("サインアップエラー:", error);
      setError(error.message || "アカウント作成中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>新規登録</h1>
        {success ? (
          <div className={styles.successMessage}>
            <p>アカウント登録が完了しました！</p>
            <p>メールアドレスの確認が必要です。メールをご確認ください。</p>
            <p>確認後、<Link href="/signin">ログイン</Link>してください。</p>
          </div>
        ) : (
          <>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>お名前</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>メールアドレス</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>パスワード</label>
                <div className={styles.passwordInputContainer}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.input} ${styles.passwordInput}`}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className={styles.authButton}
                disabled={loading}
              >
                {loading ? "登録中..." : "登録する"}
              </button>
            </form>
            <p className={styles.authLink}>
              すでにアカウントをお持ちの方は<Link href="/signin">ログイン</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
