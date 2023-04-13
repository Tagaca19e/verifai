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
    <div className="mx-auto flex h-[100vh] max-w-[1400px] flex-col justify-between">
      <Navbar session={session} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
