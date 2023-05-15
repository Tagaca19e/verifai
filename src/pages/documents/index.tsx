import clientPromise from 'lib/mongodb';
import Header from '@/components/documents/Header';
import Link from 'next/link';
import mammoth from 'mammoth';
import React, { useRef, useState } from 'react';
import Router from 'next/router';
import { ArrowUpOnSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Session } from 'src/utils/types';
import { UserDocument } from 'src/utils/interfaces';

export default function Documents({
  session,
  userDocuments,
  documentTemplates,
}: {
  session: Session;
  userDocuments: UserDocument[];
  documentTemplates: UserDocument[];
}) {
  const [currentUserDocuments, setCurrentUserDocuments] =
    useState<UserDocument[]>(userDocuments);
  const [filterTerm, setFilterTerm] = useState<string>('');

  const handleDelete = async (documentId: string) => {
    let res = await fetch('/api/delete-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: documentId,
        email: session.user.email,
      }),
    });

    let data = await res.json();
    setCurrentUserDocuments(data.updatedDocuments);
  };

  /* Filters documents based on search term */
  const filterUserDocuments = (searchTerm: string) => {
    setFilterTerm(searchTerm);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = async () => {
    fileInputRef.current?.click();
  };

  interface MammothRawTextResult {
    value: string;
    messages: any[] | undefined;
  }

  const createNewDocumentFromFileUpload = async (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async () => {
        const buffer = Buffer.from(fileReader.result as ArrayBuffer);
        let content = '';
        switch (file.type) {
          case 'text/plain':
            content = buffer.toString().replaceAll('\n', '<br/>');
            break;

          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            content = await mammoth
              .extractRawText({ arrayBuffer: buffer })
              .then(async (result: MammothRawTextResult) => {
                return result.value.replaceAll('\n', '<br/>');
              });
        }

        const response = await fetch('/api/upload-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: file.name,
            content: content,
          }),
        });

        const data = await response.json();
        if (response.status === 200) {
          Router.push(`/documents/${data.documentId}`);
        }
      };
    }
  };

  return (
    <>
      <Header filterUserDocuments={filterUserDocuments} session={session} />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="my-8 flex gap-8 overflow-auto">
            {/* Add new document */}
            <span className="relative flex h-[250px] w-[175px] cursor-pointer flex-col items-center justify-center rounded-md border border-gray-200">
              <Link
                className="flex h-full w-[175px] items-center justify-center bg-gray-50 hover:bg-gray-100"
                href="/documents/new"
              >
                <PlusIcon className="h-11 w-11 text-gray-800" />
              </Link>
              <span
                onClick={uploadFile}
                className="absolute bottom-0 z-30 flex w-full items-center justify-center bg-white py-2 text-sm text-gray-800 hover:text-red-400"
              >
                <ArrowUpOnSquareIcon className="mr-2 inline-block h-5 w-5 text-red-400" />
                Upload
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={createNewDocumentFromFileUpload}
                className="hidden"
                accept=".docx,.txt"
              />
            </span>

            {/* Document templates */}
            {documentTemplates.map((document) => (
              <div key={document._id}>
                <Link href={`../documents/${document._id}`}>
                  <div className="flex h-[250px]  w-[175px] cursor-pointer flex-col justify-between rounded-md border border-gray-200 bg-gray-50 hover:opacity-75">
                    <div
                      className="h-[200px] items-center justify-center overflow-hidden p-2 text-[6px]"
                      dangerouslySetInnerHTML={{ __html: document.content }}
                    ></div>
                    <div className="w-full rounded-b-md bg-white p-2 text-sm">
                      {document.title}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mb-16 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {/* User documents */}
            {currentUserDocuments.map((document) => (
              <>
                {document.title
                  .toLowerCase()
                  .includes(filterTerm.toLowerCase()) && (
                  <div
                    key={document._id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="aspect-none h-96 overflow-hidden bg-gray-50 p-2 group-hover:opacity-75">
                      <span
                        className="text-[10px]"
                        dangerouslySetInnerHTML={{ __html: document.content }}
                      ></span>
                    </div>
                    <div className="flex flex-1 items-center justify-between p-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        <Link href={`../documents/${document._id}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
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
                )}
              </>
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

  const client = await clientPromise;
  const db = client.db('verifai');

  const userDocuments = await db
    .collection('documents')
    .find({ owner: session?.user?.email })
    .toArray();

  const documentTemplates = await db
    .collection('document_templates')
    .find()
    .toArray();

  return {
    props: {
      session,
      userDocuments,
      documentTemplates,
    },
  };
}
