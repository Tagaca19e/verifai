import { AppContext } from './AppContextProvider';
import { createId } from '@/utils/helpers';
import { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { Session } from 'src/utils/types';
import {
  AppContextProps,
  InputTextResult,
  UserDocument,
} from 'src/utils/interfaces';

export default function TextInput({
  session,
  documentTitle,
  savedDocument,
}: {
  session: Session;
  documentTitle: string;
  savedDocument?: UserDocument;
}) {
  const { setIsLoading, results, setResults } =
    useContext<AppContextProps>(AppContext);
  const textInputRef: RefObject<HTMLDivElement> = useRef(null);
  const [userDocument, setUserDocument] = useState<UserDocument>({
    _id: savedDocument?._id || createId(`${documentTitle}${Date.now()}`),
    owner: session.user.email,
    title: documentTitle,
    content: savedDocument?.content || '',
    results: savedDocument?.results || results,
  });

  // Replace content with saved content.
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.innerHTML = savedDocument?.content || '';
    }
  }, [savedDocument?.content]);

  // Replace results with saved results.
  useEffect(() => {
    setResults(savedDocument?.results || []);
  }, [savedDocument?.results, setResults]);

  useEffect(() => {
    setUserDocument((prevUserDocument) => ({
      ...prevUserDocument,
      title: documentTitle,
    }));
  }, [documentTitle]);

  useEffect(() => {
    const saveUserDocument = async () => {
      await fetch('../api/save-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDocument),
      });
    };
    saveUserDocument();
  }, [userDocument]);

  /* Removes all html content from the clipboard. */
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let text = event.clipboardData?.getData('text/plain');

    // Replace new lines with <br> tags to make it a list for the senteces.
    text = text.replace(/\n/g, '<br>');

    if (textInputRef.current) {
      textInputRef.current.innerHTML += text;
    }
    setUserDocument({
      ...userDocument,
      content: textInputRef.current?.innerHTML || '',
    });
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
    const selection = window.getSelection();
    if (!selection) return;
    if (textInputRef.current) {
      const text = textInputRef.current.innerHTML;

      // Reset the text input from any hightlighted errors, when user tries to
      // start typing.
      if (text.match(/<\/?span[\sa-z=\-0-9"]*>/gi)) {
        const paragraphElement = selection.anchorNode?.parentElement;
        paragraphElement?.classList.remove('border-b-2');
      }
    }
    setUserDocument({
      ...userDocument,
      content: textInputRef.current?.innerHTML || '',
    });
  };

  const handleSubmit = () => {
    function verifyText(sentence: string) {
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
    // Remove all html elements except <br> tags.
    input = input.replace(
      /<(?!br\s*\/?)[a-z][^>]*>|<\/(?!br\s*\/?)[a-z][^>]*>/gi,
      ''
    );

    // Reset the text input from any hightlighted errors.
    if (textInputRef.current) textInputRef.current.innerHTML = input;

    let texts = input ? input.split('<br>') : [];

    // Remove empty strings.
    texts = texts.filter((text) => text);
    const verifyTextApiCalls = [
      ...texts.map((text: string) => verifyText(text)),
    ];

    setIsLoading(true);
    Promise.all(verifyTextApiCalls)
      .then((results) => {
        let inputTextResults = results.map(async (result) => {
          return await result.json();
        });
        return Promise.all(inputTextResults);
      })
      .then((inputTextResults: InputTextResult[]) => {
        setResults(inputTextResults);
        setUserDocument({ ...userDocument, results: inputTextResults });

        if (textInputRef.current) {
          for (let inputTextResult of inputTextResults) {
            if (inputTextResult.score.gpt > inputTextResult.score.human) {
              textInputRef.current.innerHTML =
                textInputRef.current.innerHTML.replace(
                  inputTextResult.text,
                  `<span class="border-b-2 border-red-400">${inputTextResult.text}</span>`
                );
            }
          }
        }

        // Update user document with the new content and results.
        setUserDocument({
          ...userDocument,
          content: textInputRef.current?.innerHTML || '',
          results: inputTextResults,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-8">
      <div className="mt-2">
        <div className="-m-0.5 rounded-lg p-0.5">
          <div
            ref={textInputRef}
            className="min-h-[600px] w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none"
            contentEditable
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onInput={handleInput}
          ></div>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary_dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
