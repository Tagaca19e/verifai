import React from 'react';
import { GetServerSideProps } from 'next';
import {
  getSession,
  signOut,
  GetSessionParams,
  useSession,
} from 'next-auth/react';

interface User {
  name: string;
  email: string;
}

export default function Dashboard({ user }: { user: User }) {
  console.log('session:', useSession());
  return (
    <div>
      <h1>
        Hello {user.name} ({user.email})
      </h1>
      <button
        className="rounded-md bg-primary p-2 text-white"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSideProps) {
  const session = await getSession(context as GetSessionParams);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}
