"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { createUser } from "../register/actions";
import styles from "./signup.module.css";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Server Action 呼び出し
    const result = await createUser({ email, password });
    if (!result.success) {
      setError(result.error || "Registration failed");
      return;
    }

    // 作成成功 => サインイン
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
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>新規登録</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
          />
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
          />
          <button className={styles.loginButton} type="submit">
            新規登録
          </button>
          <Link href="/signin" className={styles.signinLink}>
            ログインはこちら
          </Link>
        </form>
      </div>
    </div>
  );
}
