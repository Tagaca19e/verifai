import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <h1>Header</h1>
      <main>{children}</main>
      <h1>Footer</h1>
    </>
  );
}
