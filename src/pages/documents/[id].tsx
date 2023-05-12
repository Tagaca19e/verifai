import clientPromise from 'lib/mongodb';
import Image from 'next/image';
import Link from 'next/link';
import Result from 'src/components/Result';
import ResultMetrics from '../../components/ResultMetrics';
import TextInput from '@/components/TextInput';
import { AppContext } from '../../components/AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';
import { createId } from '@/utils/helpers';
import { Fragment, useContext, useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { hasCookie, setCookie } from 'cookies-next';
import { Menu, Transition } from '@headlessui/react';
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
    savedDocument?.title || 'Untitled document'
  );

  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  /* Gets the current position of the caret to animate the results that was
   * generated for the specific text. */
  const getCaretIndexPosition = (resetCaretIndexPosition?: boolean) => {
    if (resetCaretIndexPosition) {
      setActiveResultId(null);
      return;
    }
    const selection = window.getSelection();
    const selectedElement = selection?.anchorNode?.parentElement;
    setActiveResultId(selectedElement?.id || null);
  };

  /* Updates active result id when clicking on the result card. */
  function updateActiveResultId(id: string | null) {
    setActiveResultId(id);
  }

  const updateUserDocument = async (document: UserDocument) => {
    setUserDocument(document);
  };

  const { setResults } = useContext<AppContextProps>(AppContext);
  const [userDocument, setUserDocument] = useState<UserDocument>({
    _id: savedDocument?._id || newDocumentId,
    owner: session.user.email,
    title: documentTitle,
    content: savedDocument?.content || '',
    rating: {
      gpt: savedDocument?.rating?.gpt || 0,
      human: savedDocument?.rating?.human || 0,
      metrics: savedDocument?.rating?.metrics || {},
    },
    results: savedDocument?.results || [],
  });

  // Replace document title with saved title.
  useEffect(() => {
    setUserDocument((prevUserDocument) => ({
      ...prevUserDocument,
      title: documentTitle,
    }));
  }, [documentTitle]);

  // Keep state for results in sync with saved results.
  useEffect(() => {
    setResults(savedDocument?.results || []);
  }, [savedDocument?.results, setResults]);

  // Save any changes made to the document in the database.
  useEffect(() => {
    const saveUserDocument = async () => {
      try {
        await fetch('../api/save-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDocument),
        });
      } catch (error) {
        console.error(error);
      }
    };
    saveUserDocument();
  }, [userDocument]);

  return (
    <>
      <div className="flex h-[100vh]">
        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
              {/* Home button */}
              <Link
                href="/documents"
                className="m-auto border-r border-gray-200 px-4"
              >
                <Image
                  src="/logos/verifai.svg"
                  alt="Back to documents"
                  width={40}
                  height={40}
                />
              </Link>
              <div className="flex flex-1 justify-between px-4 sm:px-6">
                <div className="flex flex-1">
                  <div className="my-auto">
                    {/* Document title  */}
                    <input
                      autoComplete="off"
                      type="text"
                      name="file_title"
                      value={documentTitle}
                      className="block w-full rounded-md border-0 py-1.5  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      onChange={(e) => setDocumentTitle(e.target.value)}
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
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="m-auto flex max-w-[2000px] flex-1 items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              {/* Primary column */}
              <section
                aria-labelledby="primary-heading"
                className="flex h-full min-w-0 flex-1 flex-col sm:w-[800px] lg:order-last"
              >
                <TextInput
                  savedDocument={savedDocument}
                  userDocument={userDocument}
                  getCaretIndexPosition={getCaretIndexPosition}
                  activeResultId={activeResultId}
                  updateUserDocument={updateUserDocument}
                />
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden w-fit overflow-y-scroll border-l border-gray-200 bg-white lg:flex lg:w-[500px] xl:w-[700px]">
              <Result
                activeResultId={activeResultId}
                onChangeActiveResultId={updateActiveResultId}
              />
              <ResultMetrics userDocument={userDocument} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const client = await clientPromise;
  const db = client.db('verifai');
  const { req, res } = context;
  const { id } = context.query;

  // Set cookie for new document id to prevent redirect to error page or
  // create new document from a document template.
  if (id === 'new' || id === 'harry' || id === 'quantum') {
    const newDocumentId = createId(`${session?.user?.email}${Date.now()}`);

    switch (id) {
      case 'new':
        setCookie(newDocumentId, true, { req, res, maxAge: 300 });
        break;

      case 'harry':
      case 'quantum':
        const harryDocument = await db
          .collection('document_templates')
          // @ts-ignore
          .findOne({ _id: id }, { projection: { _id: 0 } });
        await db.collection('documents').insertOne({
          // @ts-ignore
          _id: newDocumentId,
          owner: session?.user?.email,
          ...harryDocument,
        });
        break;
    }

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

  return {
    props: {
      session,
      newDocumentId: id,
      savedDocument: document[0] || null,
    },
  };
}
