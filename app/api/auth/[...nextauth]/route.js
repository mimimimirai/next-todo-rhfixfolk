import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("Attempting login with:", credentials.username);
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.username }
          });
          console.log("Found user:", user);

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            console.log("Password validation:", isValid);
            
            if (isValid) {
              return {
                id: user.id,
                name: user.email,
                email: user.email
              };
            }
          }
          throw new Error("Invalid username or password");
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return '/'
    }
  },
  debug: false  // デバッグモードを無効化
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 