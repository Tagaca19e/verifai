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
                ' AI generated in just strictly bulleted points in no more' +
                ' than 20 words and 6 bullet points, also give me' +
                ' a score(out of 10) for coherence score and repetition' +
                ' score, personal style score, and originality score make a' +
                ' divider between the reasons and scores, we need to parse it' +
                '\n' +
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

          /*
          {
            role: 'assistant',
            content: 'Reasons why this text is AI generated:\n' +
              '\n' +
              '- The language used is very formal and lacks personal touches.\n' +
              '- There is a lack of coherence between the sentences, making the overall text difficult to follow.\n' +
              '- There is a repetition of certain words and phrases such as "experiences" and "values".\n' +
              '- The content of the text is very general and lacks specific details or examples.\n' +
              "- The language is too polished and doesn't reflect a natural human tone.\n" +
              '\n' +
              'Coherence Score: 3/10\n' +
              'Repetition Score: 6/10\n' +
              'Personal Style Score: 2/10\n' +
              'Originality Score: 2/10'
          }
          */

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
              inputTextResult.metrics.personalStyle =
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

// 'Coherence Score: 3/10\n' +
//   'Repetition Score: 6/10\n' +
//   'Unusual Words Score: 3/10\n' +
//   'Personal Style Score: 2/10\n' +
//   'Originality Score: 2/10';
// "Reasons why it is AI generated:

// • Repetitive use of similar sentiments and phrases
// • Lack of a clear and consistent argument or purpose
// • Use of abstract language and concepts without much specificity
// • Lack of personal voice or perspective in the writing
// • Few specific details or anecdotes to support the overall points

// Coherence score: 6/10. While the text has a general sense of unity and some common themes and ideas running throughout, it lacks a clear focus or argument, and the language can be abstract and disconnected.

// Repetition score: 8/10. The text repeats similar ideas and phrases without adding much new information or detail, leading to a sense of redundancy and repetition.

// Personal style score: 4/10. The text lacks a distinctive voice or perspective, and feels impersonal and generic in its approach.

// Originality score: 3/10. The text does not offer much that is new or innovative, and instead relies on common platitudes and cliches to make its points."
