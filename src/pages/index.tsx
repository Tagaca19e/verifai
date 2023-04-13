import Head from 'next/head';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { GetServerSideProps } from 'next';
import { getSession, GetSessionParams } from 'next-auth/react';
import { Session } from 'src/utils/types';

export default function Home({ session }: { session: Session }) {
  return (
    <>
      <Head>
        <title>Verifai</title>
        <meta name="description" content="AI generated essay classifier" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Layout session={session}>
          <Hero />
        </Layout>
      </>
    </>
  );
}

export async function getServerSideProps(context: GetServerSideProps) {
  const session = await getSession(context as GetSessionParams);

  return {
    props: {
      session,
    },
  };
}
