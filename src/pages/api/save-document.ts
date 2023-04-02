import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from 'lib/mongodb';

export default async function saveDocument(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.title === 'Untitled Document' && req.body.content === '') {
    res.status(200).json({ message: 'empty documents not saved' });
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db('verifai');

    // Check if document exists.
    const document = await db
      .collection('documents')
      .find({ _id: req.body['_id'] })
      .toArray();

    if (!document[0]) {
      const result = await db.collection('documents').insertOne(req.body);

      if (result.acknowledged) {
        res.status(200).json({ message: 'saved successfully!' });
      } else {
        res.status(400).json({ error: 'something went wrong with save!' });
      }
    } else {
      const result = await db.collection('documents').updateOne(
        { _id: req.body['_id'] },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            results: req.body.results,
          },
        }
      );

      if (result.acknowledged) {
        res.status(200).json({ message: 'updated successfully!', id: req.body['_id'] });
      } else {
        res.status(400).json({ error: 'something went wrong with update!' });
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}
