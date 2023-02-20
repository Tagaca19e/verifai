import React from 'react';
import { signIn } from 'next-auth/react';

interface Props {
  session: any;
}

export default function Login({ session }: Props = { session: undefined }) {
  return (
    <>
      <h1>Session: {session ? 'Authenticated' : 'Not authenticated'}</h1>
      <button
        className="rounded-md bg-primary p-2 text-white"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
