import Head from 'next/head';
import { Inter } from '@next/font/google';
import { GetServerSideProps } from 'next';
import { getSession, GetSessionParams } from 'next-auth/react';
import Layout from '../components/layout';
import Login from '../components/login';

const inter = Inter({ subsets: ['latin'] });

export default function Home({ session }: { session: any }) {
  return (
    <>
      <Head>
        <title>Verifai</title>
        <meta name="description" content="AI generated essay classifier" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Layout>
          <h1>Home</h1>
          <Login session={session} />
        </Layout>
      </>
    </>
  );
}

export async function getServerSideProps(context: GetServerSideProps) {
  const session = await getSession(context as GetSessionParams);
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
