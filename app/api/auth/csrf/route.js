import { getCsrfToken } from "next-auth/react"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const csrfToken = await getCsrfToken({ req: request })
    
    if (!csrfToken) {
      return NextResponse.json(
        { error: "Failed to get CSRF token" },
        { status: 400 }
      )
    }

    return NextResponse.json({ csrfToken })
  } catch (error) {
    console.error("CSRF token error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 