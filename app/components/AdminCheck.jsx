'use client'

import { useSession } from "next-auth/react"

export default function AdminCheck() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // 未認証ユーザーの処理
      alert("このページにアクセスするには認証が必要です");
    }
  })

  if (status === "loading") {
    return <div>Loading or not authenticated...</div>
  }

  return <div>User is logged in</div>
} 