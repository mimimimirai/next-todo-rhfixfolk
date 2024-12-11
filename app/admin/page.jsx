'use client'

import { useSession } from "next-auth/react"
import AdminCheck from '../components/AdminCheck'

export default function AdminPage() {
  const { data: session } = useSession()
  return <AdminCheck />
}

AdminPage.auth = {
  role: "admin",
  loading: <div>Loading admin page...</div>,
  unauthorized: "/api/auth/signin", // サインインページにリダイレクト
} 