import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import AppContextProvider from '@/components/AppContextProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </AppContextProvider>
  );
}
