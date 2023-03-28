import { AppContext } from './AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';
import { Tab } from '@headlessui/react';
import { useContext } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const { setIsLoading, setResult, setError } =
    useContext<AppContextProps>(AppContext);

  interface Group {
    label: string;
    score: number;
  }

  const parseResult = (response: Group[][]) => {
    const classifierScores = response[0];

    let result: { [key: string]: number } = {};
    for (let score of classifierScores) {
      result[score.label] = score.score;
    }
    return result;
  };

  // TODO(etagaca): Convert to an api endpoint in the api folder.
  const validateInput = async (data: string) => {
    setIsLoading(true);
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta',
      {
        headers: {
          Authorization: 'Bearer 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',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: data,
        }),
      }
    );

    const result = await response.json();
    if (result.error) {
      setError(result.error);
    } else {
      // NOTE: Model is booting up and is not ready yet.
      setResult(parseResult(result));
      setError('');
    }

    setIsLoading(false);
    return result;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      text: { value: string };
    };

    validateInput(target.text?.value || '').then((response) => {
      console.log(JSON.stringify(response));
    });
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit}>
        <Tab.Group>
          {({ selectedIndex }) => (
            <>
              <Tab.List className="flex items-center">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                      'rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                    )
                  }
                >
                  Text
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                      'ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                    )
                  }
                >
                  OCR
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                  <label htmlFor="text" className="sr-only">
                    text
                  </label>
                  <div>
                    <textarea
                      rows={40}
                      name="text"
                      id="text"
                      className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:py-1.5 sm:text-sm sm:leading-6"
                      placeholder="Type your text..."
                      defaultValue={''}
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                  <div className="border-b">
                    <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800">
                      ERROR: NOT YET IMPLEMENTED! :(
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary_dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
}
