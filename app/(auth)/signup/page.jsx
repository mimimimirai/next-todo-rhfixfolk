"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { createAccount } from "@/app/account/actions";
import Link from "next/link";
import styles from "../auth.module.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await createAccount({ name, email, password });
    if (!result.success) {
      setError(result.error || "登録に失敗しました");
      return;
    }

    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginResult?.error) {
      setError(loginResult.error);
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>新規登録</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="お名前"
            required
          />
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            required
          />
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
          />
          <button className={styles.button} type="submit">
            登録
          </button>
          <Link href="/signin" className={styles.link}>
            ログインはこちら
          </Link>
        </form>
      </div>
    </div>
  );
}
