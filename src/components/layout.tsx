import Footer from './footer';
import Navbar from './navbar';
import React from 'react';
interface LayoutProps {
  session: any;
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
