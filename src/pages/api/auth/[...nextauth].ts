import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';

export default NextAuth({
  // TODO(etagaca): Add more providers.
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs.
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin.
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
