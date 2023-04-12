import Header from '@/components/documents/Header';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'src/utils/types';
import { TrashIcon } from '@heroicons/react/24/outline';
import { UserDocument } from 'src/utils/interfaces';
import { useState } from 'react';

export default function Documents({
  session,
  userDocuments,
}: {
  session: Session;
  userDocuments: UserDocument[];
}) {
  const [currentUserDocuments, setCurrentUserDocuments] =
    useState<UserDocument[]>(userDocuments);

  const handleDelete = async (documentId: string) => {
    let res = await fetch('/api/delete-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: documentId,
      }),
    });

    let data = await res.json();
    setCurrentUserDocuments(data.updatedDocuments);
  };

  const filterUserDocuments = (searchTerm: string) => {
    const filteredDocuments = userDocuments.filter((document) => {
      return document.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setCurrentUserDocuments(filteredDocuments);
  };

  return (
    <>
      <Header filterUserDocuments={filterUserDocuments} session={session} />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {currentUserDocuments.map((document) => (
              <div
                key={document._id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="aspect-h-4 aspect-w-3 overflow-hidden bg-gray-50 p-2 sm:aspect-none group-hover:opacity-75 sm:h-96">
                  <span
                    className="text-[10px]"
                    dangerouslySetInnerHTML={{ __html: document.content }}
                  ></span>
                </div>
                <div className="flex flex-1 items-center justify-between p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link href={`../documents/${document._id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {document.title}
                    </Link>
                  </h3>
                  <a
                    className="relative z-20 cursor-pointer rounded-full p-2 hover:bg-gray-200"
                    onClick={() => handleDelete(document._id)}
                  >
                    <TrashIcon className="m-0 h-5 text-red-400" />
                  </a>
                </div>
              </div>
            ))}
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

  // TODO(etagaca): Handle error when fetching user documents.
  const response = await fetch(
    `${process.env.NEXTJS_URL}/api/list-user-documents`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session?.user?.email,
      }),
    }
  );

  const data = await response.json();
  return {
    props: {
      session,
      userDocuments: data.documents,
    },
  };
}
