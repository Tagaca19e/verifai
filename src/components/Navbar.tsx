import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { Session } from 'src/utils/types';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar({ session }: { session: Session }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Verfai</span>
            <Image
              src="/logos/verifai.svg"
              alt="Verifai Logo"
              width={50}
              height={50}
            />
          </Link>
        </div>

        <div className="block lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!session) {
                signIn('google', { callbackUrl: '/documents' });
              } else {
                window.location.href = '/documents';
              }
            }}
            className="rounded-md border border-gray-500 py-2.5 px-3 text-sm font-semibold text-gray-900 transition-all duration-200 hover:rounded-[100px]"
          >
            {session ? 'Dashboard' : 'Login'}{' '}
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
