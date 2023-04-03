import Header from '@/components/documents/Header';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'src/utils/types';
import { UserDocument } from 'src/utils/interfaces';

export default function Documents({
  session,
  userDocuments,
}: {
  session: Session;
  userDocuments: UserDocument[];
}) {
  return (
    <>
      <Header session={session} />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {userDocuments.map((document) => (
              <div
                key={document._id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
                  <Image
                    src="/file-placeholder.png"
                    className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    alt={document.title}
                    width={400}
                    height={200}
                  />
                </div>
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    <a href={`../documents/${document._id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {document.title}
                    </a>
                  </h3>
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
