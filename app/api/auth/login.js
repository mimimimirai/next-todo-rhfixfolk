import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password } = await request.json();

  // ユーザーの認証を行う（ここでは簡単な例としてハードコードされたユーザーを使用）
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken(user);

  return NextResponse.json({ token }, { status: 200 });
}