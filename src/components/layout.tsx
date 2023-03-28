import Footer from './Footer';
import Navbar from './Navbar';
import React from 'react';
import { Session } from 'src/utils/types';

interface LayoutProps {
  session: Session;
  children: React.ReactNode;
}

export default function Layout({ session, children }: LayoutProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
