import React from 'react';

interface Props {
  session: any;
}

export default function Login({ session }: Props = { session: undefined }) {
  return (
    <>
      <h1>Session: {session ? 'Authenticated' : 'Not authenticated'}</h1>
    </>
  );
}
