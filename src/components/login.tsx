import React from 'react';
import { Session } from '../utils/types';

export default function Login({ session }: { session: Session }) {
  return (
    <>
      <h1>Session: {session ? 'Authenticated' : 'Not authenticated'}</h1>
    </>
  );
}
