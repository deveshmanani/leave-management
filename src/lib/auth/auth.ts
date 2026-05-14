import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import type { Role } from "@/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user, profile }) {
      if (user && user.email) {
        try {
          const { getUserByEmail, createUser } = await import(
            "@/services/users.service"
          );

          let sheetUser = await getUserByEmail(user.email);

          if (!sheetUser) {
            sheetUser = await createUser({
              name: user.name ?? user.email,
              email: user.email,
            });
          }

          token.role = (sheetUser.role as Role) ?? "user";
        } catch (err) {
          console.error("[Auth] Failed to fetch role from Sheets:", err);
          token.role = "user" satisfies Role;
        }
      }

      if (profile?.picture) {
        token.picture = profile.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.image = token.picture as string | undefined;
      }
      return session;
    },
  },
});
