import { getProviders } from "next-auth/react"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const providers = await getProviders()
    console.log("Available providers:", providers)
    
    if (!providers) {
      return NextResponse.json(
        { error: "No providers available" },
        { status: 404 }
      )
    }

    return NextResponse.json(providers)
  } catch (error) {
    console.error("Providers error:", error)
    return NextResponse.json(
      { error: "Failed to get providers" },
      { status: 500 }
    )
  }
} 