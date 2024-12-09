import { NextResponse } from "next/server";
import { generateToken } from "../../../../lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body); // リクエストボディの確認

    if (!body.user || typeof body.user.id !== 'number') {
      console.log("Invalid user data received:", body);
      return NextResponse.json(
        { error: "Invalid user data: id must be a number" },
        { status: 400 }
      );
    }

    // ユーザーデータを適切な形式に整形
    const userData = {
      id: body.user.id,
      // 必要に応じて他のユーザー情報も追加
    };

    console.log("Generating token for user data:", userData);
    const token = generateToken(userData);
    console.log("Generated token successfully");

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Token generation failed: " + error.message },
      { status: 500 }
    );
  }
} 