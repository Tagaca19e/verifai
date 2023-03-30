import type { NextApiRequest, NextApiResponse } from 'next';

export default async function validateInput(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta',
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: req.body.data,
      }),
    }
  );

  const result = await response.json();
  res.status(200).json(result);
}
