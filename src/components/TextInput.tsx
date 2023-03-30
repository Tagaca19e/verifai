import { AppContext } from './AppContextProvider';
import { AppContextProps, Result } from 'src/utils/interfaces';
import { Tab } from '@headlessui/react';
import { useContext, useRef, RefObject } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TextInput() {
  const textInputRef: RefObject<HTMLDivElement> = useRef(null);
  const { setIsLoading, setResults, setError } =
    useContext<AppContextProps>(AppContext);

  /* Removes all html content from the clipboard. */
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let text = event.clipboardData?.getData('text/plain');

    // Replace new lines with <br> tags to make it a list for the senteces.
    text = text.replace(/\n/g, '<br>');

    if (textInputRef.current) {
      textInputRef.current.innerHTML += text;
    }
  };

  /* Prevents auto creation of div and p elements when typing. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.execCommand('insertLineBreak', false, '');
    }
  };

  /* Removes all inserted <span> tags from highlighted errors when user tries
   * to change input. */
  const handleInput = () => {
    if (textInputRef.current) {
      const text = textInputRef.current.innerHTML;

      // Reset the text input from any hightlighted errors, when user tries to
      // start typing.
      if (text.match(/<\/?span[\sa-z=\-0-9"]*>/gi)) {
        const spanElements =
          textInputRef.current.querySelectorAll<HTMLSpanElement>('span');
        spanElements.forEach((spanElement) => {
          spanElement.classList.remove('border-b-2');
        });
      }
    }
  };

  const verifyTextInput = () => {
    function verifySentence(sentence: string) {
      return fetch('../api/validate-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: sentence,
        }),
      });
    }

    let input = textInputRef?.current?.innerHTML || '';
    // Remove all inserted <span> tags from highlighted errors.
    input = input.replace(/<\/?span[\sa-z=\-0-9"]*>/gi, '');

    // Reset the text input from any hightlighted errors.
    if (textInputRef.current) textInputRef.current.innerHTML = input;

    let sentences = input ? input.split('<br>') : [];

    // Remove empty strings.
    sentences = sentences.filter((sentence) => sentence);
    const promises = [
      ...sentences.map((sentence: string) => verifySentence(sentence)),
    ];

    setIsLoading(true);
    Promise.all(promises)
      .then((results) => {
        let data = results.map(async (result) => {
          let res = await result.json();

          // Catch the errors fro the API.
          return res[0] || [res];
        });
        return Promise.all(data);
      })
      .then((data: Result[][]) => {
        setResults(data);

        if (textInputRef.current) {
          // TODO(etagaca): Handle error case when the API returns an error.
          for (let i = 0; i < data.length; i++) {
            const result = data[i];
            let gptScore = 0,
              humanScore = 0;

            for (let resultType of result) {
              if (resultType.label === 'ChatGPT') {
                gptScore = resultType.score || 0;
              } else if (resultType.label === 'Human') {
                humanScore = resultType.score || 0;
              }
            }

            if (gptScore > humanScore) {
              textInputRef.current.innerHTML =
                textInputRef.current.innerHTML.replace(
                  sentences[i],
                  `<span class="border-b-2 border-red-400">${sentences[i]}</span>`
                );
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  };

  return (
    <div className="p-8">
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
                  <div
                    ref={textInputRef}
                    className="min-h-[600px] w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none"
                    contentEditable
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onInput={handleInput}
                  ></div>
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
          onClick={verifyTextInput}
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary_dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
