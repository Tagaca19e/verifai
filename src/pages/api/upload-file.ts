import clientPromise from 'lib/mongodb';
import { createId } from '../../utils/helpers';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const newDocumentId = createId(`${session?.user?.email}${Date.now()}`);

  const client = await clientPromise;
  const db = client.db('verifai');
  const { title, content } = req.body;

  // Create new document based on a file.
  const result = await db.collection('documents').insertOne({
    // @ts-ignore
    _id: newDocumentId,
    owner: session?.user?.email,
    title: title,
    content: content,
    rating: {
      gpt: 0,
      human: 0,
      metrics: {},
    },
    results: [],
  });

  if (result.acknowledged) {
    res
      .status(200)
      .json({ message: 'saved successfully!', documentId: newDocumentId });
  } else {
    res.status(400).json({ error: 'something went wrong with save!' });
  }
}
