import { Configuration, OpenAIApi } from 'openai';
import {
  HuggingFaceModelResult,
  InputTextResult,
} from '../../utils/interfaces';
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

  let huggingFaceModelResult = await response.json();
  let inputTextResult: InputTextResult = {
    score: {
      gpt: 0,
      human: 0,
    },
    text: req.body.data,
    details: [],
  };

  if (response.status === 200) {
    huggingFaceModelResult[0].forEach((item: HuggingFaceModelResult) => {
      if (item.label === 'ChatGPT') {
        inputTextResult.score.gpt = item.score || 0;
      } else {
        inputTextResult.score.human = item.score || 0;
      }
    });

    if (inputTextResult.score.gpt > inputTextResult.score.human) {
      const configuration = new Configuration({
        organization: process.env.OPENAI_ORG_ID,
        apiKey: process.env.OPENAI_API_KEY,
      });

      const openai = new OpenAIApi(configuration);
      const gptResult = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `This text is AI generated, give me reasons why it is ai generated in just strictly bulleted points:\n${inputTextResult.text}`,
          },
        ],
      });

      if (gptResult.data.choices[0].message) {
        let details = gptResult.data.choices[0].message.content.split('\n');

        // Filter out any empty strings.
        details = details.filter((detail) => detail);

        // Replace any bulleted points, character, or numbers within details.
        details = details.map((detail) => detail.replace(/^[^a-z]+\s/gi, ''));
        inputTextResult.details = details;
      }
    }
  } else {
    // TODO(etagaca): Think about how to break down long inputs.
    inputTextResult = {
      ...inputTextResult,
      error: huggingFaceModelResult.error,
    };
  }
  res.status(200).json(inputTextResult);
}
