"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers";
import styles from "./account.module.css";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      // 認証状態を確認
      if (!user) {
        setError("認証が必要です。再度ログインしてください。");
        setIsLoading(false);
        return;
      }

      // アバターのアップロード処理
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        console.log("Uploading avatar file:", avatarFile.name);
        try {
          // ファイルサイズの検証（2MB以下）
          if (avatarFile.size > 2 * 1024 * 1024) {
            setError("ファイルサイズは2MB以下にしてください");
            setIsLoading(false);
            return;
          }
          
          // ファイルタイプの検証
          if (!avatarFile.type.startsWith('image/')) {
            setError("画像ファイルのみアップロードできます");
            setIsLoading(false);
            return;
          }
          
          // クライアント側でSupabaseに直接アップロード
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.error("No session found in client");
            setError("認証が必要です。再度ログインしてください。");
            setIsLoading(false);
            return;
          }
          
          console.log("Client: Session found for user", session.user.id);
          const userId = session.user.id;
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${userId}-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;
          
          console.log("Client: Uploading to path", filePath);
          const { data, error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, avatarFile, {
              contentType: avatarFile.type,
              upsert: true
            });
          
          if (uploadError) {
            console.error("Avatar upload error:", uploadError);
            setError("アバターのアップロードに失敗しました: " + uploadError.message);
            setIsLoading(false);
            return;
          }
          
          // 公開URLを取得
          const { data: { publicUrl } } = supabase.storage
            .from('profiles')
            .getPublicUrl(filePath);
          
          newAvatarUrl = publicUrl;
          console.log("New avatar URL:", newAvatarUrl);
        } catch (uploadError) {
          console.error("Avatar upload error:", uploadError);
          setError("アバターのアップロード中にエラーが発生しました: " + (uploadError.message || "不明なエラー"));
          setIsLoading(false);
          return;
        }
      }

      // アカウント情報の更新（クライアント側で直接実行）
      console.log("Updating account with:", { name, email, avatar_url: newAvatarUrl });
      try {
        // セッションを再確認
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error("No session found before update");
          setError("認証が必要です。再度ログインしてください。");
          setIsLoading(false);
          return;
        }
        
        // 更新データを準備
        const updateData = {};
        
        if (name || newAvatarUrl) {
          updateData.data = {};
          
          if (name) {
            updateData.data.name = name;
          }
          
          if (newAvatarUrl) {
            updateData.data.avatar_url = newAvatarUrl;
          }
        }
        
        if (email && email !== session.user.email) {
          updateData.email = email;
        }
        
        console.log("Client: Updating user with data:", updateData);
        
        // クライアント側で直接更新
        const { data: updatedUser, error: updateError } = await supabase.auth.updateUser(updateData);
        
        if (updateError) {
          console.error("Client update error:", updateError);
          setError("アカウントの更新に失敗しました: " + updateError.message);
          setIsLoading(false);
          return;
        }
        
        console.log("Client: User updated successfully:", updatedUser);
        
        setName(name);
        setEmail(email);
        setAvatarUrl(newAvatarUrl);
        setAvatarFile(null);
        setMessage("アカウントを更新しました");
        
        // 更新後にユーザー情報を再取得
        const refreshedUser = await refreshUser();
        console.log("User refreshed:", refreshedUser);
      } catch (updateError) {
        console.error("Account update error:", updateError);
        setError("アカウント更新中にエラーが発生しました: " + (updateError.message || "不明なエラー"));
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("更新中にエラーが発生しました: " + (error.message || "不明なエラー"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
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
          
          <div className={styles.avatarContainer}>
            <div className={styles.avatar} onClick={handleAvatarClick}>
              {(avatarPreview || avatarUrl) ? (
                <Image 
                  src={avatarPreview || avatarUrl} 
                  alt="プロフィール画像"
                  width={100}
                  height={100}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className={styles.avatarOverlay}>
                <span>変更</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className={styles.fileInput}
            />
          </div>
          
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