import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/espace-perso");
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/auth/signin", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
