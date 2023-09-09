import NextAuth from 'next-auth';
import type { NextAuthConfig, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { SessionUserProfile, SignInCredentials } from '@app/types';

const authConfig = {
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, request) {
        const { email, password } = credentials as SignInCredentials;
        const { user, error } = await fetch(process.env.NEXTAUTH_URL!, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }).then(async (res) => await res.json());
        if (error) throw new Error(error);
        return { id: user.id, ...user };
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token = { ...params.token, ...params.user };
      }
      console.log('jwt===>>>', params.token);
      return params.token;
    },
    async session(params) {
      console.log('session===>>>', params);
      const user = params.token as typeof params.token & SessionUserProfile;
      if (user) {
        params.session.user = {
          ...params.session.user,
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          verified: user.verified,
          role: user.role,
        };
      }
      return params.session;
    },
  },
} satisfies NextAuthConfig;

const handler = NextAuth(authConfig);

//export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// export const {
//   auth,
//   handlers: { GET, POST },
// } = NextAuth(authConfig);
