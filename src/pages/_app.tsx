import AppContextProvider from '@/components/AppContextProvider';
import NextNProgress from 'nextjs-progressbar';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <NextNProgress color="#15c39a" />
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </AppContextProvider>
  );
}
