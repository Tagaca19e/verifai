import { AppContext } from './AppContextProvider';
import { PlayCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { RefObject, useContext, useRef } from 'react';
import {
  AppContextProps,
  InputTextResult,
  UserDocument,
} from 'src/utils/interfaces';
import { useEffect } from 'react';

export default function TextInput({
  savedDocument,
  userDocument,
  getCaretIndexPosition,
  activeResultId,
  updateUserDocument,
}: {
  savedDocument?: UserDocument;
  userDocument: UserDocument;
  getCaretIndexPosition: (resetCaretIndexPosition?: boolean) => void;
  activeResultId: string | null;
  updateUserDocument: (document: UserDocument) => void;
}) {
  const { isLoading, setIsLoading, setResults } =
    useContext<AppContextProps>(AppContext);
  const textInputRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    let children = textInputRef.current?.getElementsByTagName('span');
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (activeResultId === child.id) {
          child.classList.add('bg-red-100');
        } else {
          child.classList.remove('bg-red-100');
        }
      }
    }
  }, [activeResultId]);

  /* Removes all html content from the clipboard. */
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let text = event.clipboardData?.getData('text/plain');

    // Replace new lines with <br> tags to make it a list for the senteces.
    text = text.replace(/\n/g, '<br>');

    if (textInputRef.current) {
      textInputRef.current.innerHTML += text;
    }

    updateUserDocument({
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
        paragraphElement?.classList.remove('bg-red-100');
      }
    }
    updateUserDocument({
      ...userDocument,
      content: textInputRef.current?.innerHTML || '',
    });
  };

  const handleSubmit = () => {
    if (isLoading) return;
    function verifyText(textId: number, sentence: string) {
      if (!sentence) return;
      return fetch('../api/validate-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: textId,
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

    // Keeps track of the original texts to replace highlighted texts.
    let replaceMentTexts = texts.slice();

    const verifyTextApiCalls = [
      ...texts.map((text, idx) => {
        return verifyText(idx, text);
      }),
    ];

    setIsLoading(true);
    Promise.all(verifyTextApiCalls)
      .then((results) => {
        let inputTextResults = results.map(async (result) => {
          return await result?.json();
        });
        return Promise.all(inputTextResults);
      })
      .then((inputTextResults: InputTextResult[]) => {
        // Highlight errors by index to avoid highlighting the same error twice.
        if (textInputRef.current) {
          for (let i = 0; i < inputTextResults.length; i++) {
            if (!inputTextResults[i]) continue;
            const inputTextResult = inputTextResults[i];
            if (inputTextResult.score.gpt > inputTextResult.score.human) {
              replaceMentTexts[
                i
              ] = `<span id="${i}" data-label="result" class="border-b-2 border-red-400 transition-all duration-200">${replaceMentTexts[i]}</span>`;
            }
            inputTextResults[i].id = i.toString();
          }
        }
        textInputRef.current!.innerHTML = replaceMentTexts.join('<br>');

        // Remove empty strings.
        inputTextResults = inputTextResults.filter(
          (inputTextResult) => inputTextResult
        );

        setResults(inputTextResults);

        let overallGptScore = 0;
        let overallHumanScore = 0;
        let overallMetrics = {
          coherence: 0,
          repetition: 0,
          personality: 0,
          originality: 0,
          errorTextCount: 0,
        };

        // TODO(etagaca): Sometimes the metrics do not show up even though the
        // text is highlighted as AI generated.
        inputTextResults.forEach((result) => {
          if (result.details.length) {
            overallGptScore += result.score.gpt || 0;
            overallHumanScore += result.score.human || 0;
            overallMetrics.coherence += result.metrics.coherence || 0;
            overallMetrics.repetition += result.metrics.repetition || 0;
            overallMetrics.personality += result.metrics.personality || 0;
            overallMetrics.originality += result.metrics.originality || 0;
            overallMetrics.errorTextCount += 1;
          }
        });

        overallMetrics.coherence =
          (overallMetrics.coherence / overallMetrics.errorTextCount) * 10;
        overallMetrics.repetition =
          (overallMetrics.repetition / overallMetrics.errorTextCount) * 10;
        overallMetrics.personality =
          (overallMetrics.personality / overallMetrics.errorTextCount) * 10;
        overallMetrics.originality =
          (overallMetrics.originality / overallMetrics.errorTextCount) * 10;

        // Update user document with new content, rating, and results.
        updateUserDocument({
          ...userDocument,
          content: textInputRef.current?.innerHTML || '',
          rating: {
            gpt: (overallGptScore / inputTextResults.length) * 100,
            human: (overallHumanScore / inputTextResults.length) * 100,
            metrics: overallMetrics,
          },
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
        <div className="relative -m-0.5 rounded-lg p-0.5">
          <div
            ref={textInputRef}
            className="min-h-[600px] rounded-md border-0 p-3 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none"
            contentEditable
            onBlur={() => getCaretIndexPosition(true)}
            onClick={(event) => {
              event.stopPropagation();
              getCaretIndexPosition();
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: savedDocument?.content || '' }}
          ></div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="absolute top-[50px] right-[-15px] inline-flex items-center rounded-full bg-white px-1 py-3 text-sm font-semibold text-primary shadow-lg ring-1 ring-inset hover:border-primary hover:text-primary_dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {isLoading ? (
              <SparklesIcon className="h-7 w-7 animate-pulse" />
            ) : (
              <PlayCircleIcon className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
