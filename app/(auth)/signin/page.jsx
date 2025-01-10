"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>ログイン</h1>
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
            ログイン
          </button>
          <Link href="/signup" className={styles.signupLink}>
            新規登録はこちら
          </Link>
        </form>
      </div>
    </div>
  );
}
