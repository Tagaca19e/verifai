import Image from 'next/image';
import ResultCard from './ResultCard';
import ResultCardLoader from './loaders/ResultCardLoader';
import { AppContext } from './AppContextProvider';
import { AppContextProps, InputTextResult } from 'src/utils/interfaces';
import { useContext, useEffect, useState, MouseEvent } from 'react';

export default function Result({
  activeResultId,
  onChangeActiveResultId,
}: {
  activeResultId: string | null;
  onChangeActiveResultId: (id: string | null) => void;
}) {
  const { isLoading, results, error } = useContext<AppContextProps>(AppContext);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if ((!isLoading && results?.length > 0) || error) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [isLoading, results, error, showResults]);

  // Close the results when clicking outside of the results.
  useEffect(() => {
    function handleClick(this: HTMLElement, ev: Event) {
      let element = ev.target as HTMLElement;
      if (element.dataset.label !== 'result') {
        onChangeActiveResultId(null);
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [activeResultId, onChangeActiveResultId]);

  return (
    <div className="h-max sm:w-[500px]">
      {showResults &&
        results.map((inputTextResult) => (
          <div
            key={inputTextResult.id}
            className="cursor-pointer"
            onClick={(event) => {
              // Stop the event from bubbling up to the parent.
              event.stopPropagation();
              onChangeActiveResultId(inputTextResult.id);
            }}
          >
            {!inputTextResult.error ? (
              <div
                className={`transition-all duration-200 ease-linear ${
                  (activeResultId && activeResultId === inputTextResult.id) ||
                  !activeResultId
                    ? 'h-max scale-y-100 transform'
                    : 'h-0 scale-y-0 transform overflow-hidden'
                }`}
              >
                <ResultCard inputTextResultScore={inputTextResult.score} />
                <>
                  {inputTextResult.details.map((inputTextResultDetail) => (
                    <ResultCard
                      key={inputTextResultDetail}
                      inputTextResultDetail={inputTextResultDetail}
                    />
                  ))}
                </>
              </div>
            ) : (
              <ResultCard inputTextResultError={inputTextResult.error} />
            )}
          </div>
        ))}
      {isLoading && (
        <>
          <ResultCardLoader />
          <ResultCardLoader />
        </>
      )}
      {!isLoading && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center">
          <Image
            className="w-[350px]"
            src="/nothing-to-see-here.svg"
            alt="Empty results"
            width={350}
            height={350}
          />
          <p>
            <span className="text-lg font-bold">
              Nothing to see here for now...
            </span>
          </p>
          <p>Start writing to see results from AI content detection.</p>
        </div>
      )}
    </div>
  );
}
