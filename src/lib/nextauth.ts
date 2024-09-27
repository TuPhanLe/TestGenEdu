import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { compareSync } from "bcrypt-ts";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token }) => {
      console.log(token);

      // Kiểm tra nếu token đã có trường sub
      if (token.sub) {
        // Nếu có, hãy cập nhật nó với id của người dùng
        token.id = token.sub; // Cập nhật token.id thành token.sub
      }

      // Tìm người dùng trong cơ sở dữ liệu
      const db_user = await prisma.user.findFirst({
        where: {
          id: token.id,
        },
      });

      if (db_user) {
        // Cập nhật thông tin người dùng vào token
        token.role = db_user.role;
        token.name = db_user.name;
        token.email = db_user.email;
      }

      return token;
    },

    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      console.log(session.user);

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "UserName", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username và password là bắt buộc");
        }

        const user = await prisma.user.findUnique({
          where: { userName: credentials.username },
        });
        console.log(user);

        if (user) {
          // const decryptedPassword = compareSync(
          //   user.password,
          //   credentials.password
          // );
          // if (decryptedPassword) {

          // } else {
          //   throw new Error("Tài khoản không tồn tại");
          // }
          return { id: user.id, userName: user.userName, role: user.role };
        } else {
          return null;
        }
      },
    }),
  ],
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
