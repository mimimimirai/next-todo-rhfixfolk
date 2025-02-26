import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスまたはパスワードが入力されていません")
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        }).catch(() => {
          throw new Error("データベースエラーが発生しました")
        })

        if (!user || !user.password) {
          throw new Error("ユーザーが見つかりません")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("メールアドレスまたはパスワードが正しくありません")
        }

        return { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};