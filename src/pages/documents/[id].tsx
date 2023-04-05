import clientPromise from 'lib/mongodb';
import Image from 'next/image';
import Result from 'src/components/Result';
import TextInput from '@/components/TextInput';
import { createId } from '@/utils/helpers';
import { Fragment, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { hasCookie, setCookie } from 'cookies-next';
import { Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Session } from 'src/utils/types';
import { UserDocument } from '@/utils/interfaces';

const userNavigation = [
  { name: 'Profile', href: '/', onClick: () => {} },
  { name: 'Sign out', href: '#', onClick: () => signOut() },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Document({
  session,
  newDocumentId,
  savedDocument,
}: {
  session: Session;
  newDocumentId: string;
  savedDocument: UserDocument;
}) {
  const [documentTitle, setDocumentTitle] = useState(
    savedDocument?.title || 'Untitled Document'
  );

  return (
    <>
      <div className="flex h-[100vh]">
        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
              {/* Home button */}
              <a
                href="../documents"
                className="m-auto border-r border-gray-200 px-4"
              >
                <Image
                  src="/logos/verifai.svg"
                  alt="Back to documents"
                  width={40}
                  height={40}
                />
              </a>
              <div className="flex flex-1 justify-between px-4 sm:px-6">
                <div className="flex flex-1">
                  <div className="my-auto">
                    {/* Document title  */}
                    <input
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      type="text"
                      name="file_title"
                      value={documentTitle}
                      className="block w-full rounded-md border-0 py-1.5  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative flex-shrink-0">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={session.user.image}
                          width={40}
                          height={40}
                          alt={session.user.name}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                onClick={item.onClick}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <button
                    type="button"
                    className="flex items-center justify-center rounded-full bg-primary p-1 text-white hover:bg-primary_dark focus:outline-none focus:ring-2 focus:ring-primary_dark focus:ring-offset-2"
                  >
                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">Add file</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex flex-1 items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              {/* Primary column */}
              <section
                aria-labelledby="primary-heading"
                className="flex h-full min-w-0 flex-1 flex-col lg:order-last"
              >
                <TextInput
                  session={session}
                  newDocumentId={newDocumentId}
                  documentTitle={documentTitle}
                  savedDocument={savedDocument}
                />
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden overflow-y-auto border-l border-gray-200 bg-white lg:flex lg:w-[500px] xl:w-[600px]">
              <Result />

              <div className="w-64 bg-slate-400"></div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const { id } = context.query;

  const client = await clientPromise;
  const db = client.db('verifai');

  const { req, res } = context;

  // Set cookie for new document id to prevent redirect to error page.
  if (id === 'new') {
    let newDocumentId = createId(`${session?.user?.email}${Date.now()}`);
    setCookie(newDocumentId, true, { req, res, maxAge: 300 });

    return {
      redirect: {
        destination: `/documents/${newDocumentId}`,
        permanent: false,
      },
    };
  }

  // Ignore error from needing to use ObjectId for MongoDB find function.
  // Currently using strings for id and not ObjectId.
  // @ts-ignore
  const document = await db.collection('documents').find({ _id: id }).toArray();
  if (
    !document.length &&
    id &&
    typeof id === 'string' &&
    !hasCookie(id, { req, res })
  ) {
    return {
      redirect: {
        destination: '/documents/error',
        permanent: false,
      },
    };
  }

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
      session,
      newDocumentId: id,
      savedDocument: document[0] || null,
    },
  };
}
