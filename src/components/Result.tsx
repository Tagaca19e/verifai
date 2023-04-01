import { AppContext } from './AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';
import { useContext, useEffect, useState } from 'react';
import ResultCard from './ResultCard';

export default function Result() {
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
    <div>
      {showResults &&
        results.map((inputTextResult, idx) => (
          <div key={idx}>
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
