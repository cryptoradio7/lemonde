import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/espace-perso");
      const isAuthPage = nextUrl.pathname === "/auth/signin";

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/auth/signin", nextUrl));
      }
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/espace-perso", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
