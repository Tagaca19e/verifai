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
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Verfai</span>
            <Image
              src="/logos/verifai.svg"
              alt="Verifai Logo"
              width={50}
              height={50}
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!session) {
                signIn('google', { callbackUrl: '/documents' });
              } else {
                window.location.href = '/documents';
              }
            }}
            className="hover:bg-gray-50bg rounded-md bg-primary py-2.5 px-3 text-sm font-semibold leading-6 text-white hover:bg-gray-50 hover:text-gray-900"
          >
            {session ? 'Dashboard' : 'Login'}{' '}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Verifai</span>
              <Image
                src="/logos/verifai.svg"
                alt="Verifai Logo"
                width={50}
                height={50}
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6">
                <Link
                  href={session ? '/documents}' : '/'}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!session) {
                      signIn('google', { callbackUrl: '/documents' });
                    }
                  }}
                  className="-mx-3 block max-w-max rounded-md bg-primary py-2.5 px-3 text-base font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900"
                >
                  {session ? 'Dashboard' : 'Login'}{' '}
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
