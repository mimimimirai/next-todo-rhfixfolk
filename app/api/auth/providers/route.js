import { NextResponse } from "next/server"
import { authOptions } from "../[...nextauth]/route"

export async function GET() {
  try {
    const providers = authOptions.providers.map(provider => ({
      id: provider.id,
      name: provider.name,
      type: provider.type
    }));
    
    return NextResponse.json(providers)
  } catch (error) {
    console.error("Providers error:", error)
    return NextResponse.json(
      { error: "Failed to get providers" },
      { status: 500 }
    )
  }
} 