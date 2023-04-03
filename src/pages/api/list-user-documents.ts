import clientPromise from 'lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function listUserDocuments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db('verifai');

    const documents = await db
      .collection('documents')
      .find({ 'owner': req.body.email })
      .toArray();

    res.status(200).json({ documents });
  } catch (error) {
    res.status(400).json({ error });
  }
}
