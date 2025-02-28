"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../providers";
import styles from "./account.module.css";
import { updateAccount } from "./actions";

export default function AccountPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const result = await updateAccount({ name, email });
      if (result.success) {
        setName(name);
        setEmail(email);
        setMessage("アカウントを更新しました");
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.error || "更新に失敗しました");
      }
    } catch (error) {
      setError("更新中にエラーが発生しました: " + (error.message || "不明なエラー"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>ログインが必要です</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>アカウント設定</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          {message && <p className={styles.success}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="name">お名前</label>
            <input
              id="name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button 
            className={styles.button} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "更新中..." : "更新する"}
          </button>
        </form>
      </div>
    </div>
  );
} 