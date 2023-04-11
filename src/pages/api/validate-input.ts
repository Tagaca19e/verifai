import { Configuration, OpenAIApi } from 'openai';
import {
  HuggingFaceModelResult,
  InputTextResult,
} from '../../utils/interfaces';
import { getScoreFromOpenAIMessage } from '../../utils/helpers';
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
    id: req.body.id,
    score: {
      gpt: 0,
      human: 0,
    },
    metrics: {},
    message: '',
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
      try {
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
              content:
                'This text is AI generated, give me reasons why it is' +
                ' AI generated in just STRICTLY bulleted points in no more' +
                ' than 20 words and 6 bullet points, also give me' +
                ' a score(out of 10) for coherence score and repetition' +
                ' score, personal style score, and originality score. Just' +
                ' answer with the bullet points and the score\n' +
                inputTextResult.text,
            },
          ],
        });

        if (gptResult.data.choices[0].message) {
          const openAIMessage =
            gptResult.data.choices[0].message.content.split('\n');

          // Filter out any empty strings and remove scores from details.
          let details = openAIMessage.filter(
            (detail) => detail && !detail.match(/:\s\d+\/\d+/gi)
          );

          // Replace any bulleted points, character, or numbers within details.
          details = details.map((detail) => detail.replace(/^[^a-z]+\s/gi, ''));
          inputTextResult.details = details;

          // Get result scores from the openAI message.
          openAIMessage.forEach((message) => {
            message = message.toLowerCase();
            if (message.startsWith('coherence')) {
              inputTextResult.metrics.coherence =
                getScoreFromOpenAIMessage(message);
            } else if (message.startsWith('repetition')) {
              inputTextResult.metrics.repetition =
                getScoreFromOpenAIMessage(message);
            } else if (message.startsWith('personal')) {
              inputTextResult.metrics.personality =
                getScoreFromOpenAIMessage(message);
            } else if (message.startsWith('originality')) {
              inputTextResult.metrics.originality =
                getScoreFromOpenAIMessage(message);
            }
          });

          inputTextResult.message = gptResult.data.choices[0].message.content;
        }
      } catch (openAIAPIError: any) {
        inputTextResult = {
          ...inputTextResult,
          error: openAIAPIError.message,
        };
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
