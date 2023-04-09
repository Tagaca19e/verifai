import { AppContext } from './AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';
import { useContext, useEffect, useState } from 'react';
import ResultCard from './ResultCard';

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
          <div
            key={inputTextResult.id}
            className={`${
              activeResultId && activeResultId === inputTextResult.id
                && 'border border-black'
            }`}
          >
            {!inputTextResult.error ? (
              <>
                <ResultCard inputTextResultScore={inputTextResult.score} />
                {inputTextResult.details.map((inputTextResultDetail, idx) => (
                  <ResultCard
                    key={idx}
                    inputTextResultDetail={inputTextResultDetail}
                  />
                ))}
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
