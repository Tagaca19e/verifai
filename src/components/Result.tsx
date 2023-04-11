import ResultCard from './ResultCard';
import { AppContext } from './AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';
import { useContext, useEffect, useState } from 'react';

export default function Result({
  activeResultId,
}: {
  activeResultId: string | null;
}) {
  const { isLoading, results, error } = useContext<AppContextProps>(AppContext);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if ((!isLoading && results.length > 0) || error) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [isLoading, results, error, showResults]);

  return (
    <div className="w-full">
      {showResults &&
        results.map((inputTextResult) => (
          <div key={inputTextResult.id}>
            {!inputTextResult.error ? (
              <>
                <ResultCard inputTextResultScore={inputTextResult.score} />
                <div
                  className={`transition duration-300 ease-linear ${
                    (activeResultId && activeResultId === inputTextResult.id) ||
                    !activeResultId
                      ? 'h-max scale-y-100 transform'
                      : 'h-0 scale-y-0 transform'
                  }`}
                >
                  {inputTextResult.details.map((inputTextResultDetail) => (
                    <ResultCard
                      key={inputTextResultDetail}
                      inputTextResultDetail={inputTextResultDetail}
                    />
                  ))}
                </div>
              </>
            ) : (
              <ResultCard inputTextResultError={inputTextResult.error} />
            )}
          </div>
        ))}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
