import type { NextApiRequest, NextApiResponse } from 'next';

// TODO(etagaca): Connect this API to the client side.
export default async function validateInput(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta',
    {
      headers: {
        Authorization: 'Bearer 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',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: req.body.data,
      }),
    }
  );
  
  const result = await response.json();
  return result;
}
