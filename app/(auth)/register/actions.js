"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

export async function createUser(params) {
  const email = params.email
  const password = params.password 
  const name = params.name

  if (!email || !password) {
    return { success: false, error: "Missing fields" }
  }

  const existingUser = await prisma.user.findUnique({ where: { email: email } })
  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  })

  return { success: true, user: newUser }
}