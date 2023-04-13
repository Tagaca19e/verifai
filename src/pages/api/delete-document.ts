import clientPromise from 'lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function deleteDocument(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db('verifai');
    await db.collection('documents').deleteOne({ _id: req.body.documentId });

    const updatedDocuments = await db
      .collection('documents')
      .find({ owner: req.body.email })
      .toArray();
    res.status(200).json({ updatedDocuments });
  } catch (error) {
    res.status(400).json({ error });
  }
}
