import { AppContext } from './AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';
import { useContext, useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid';

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
    <>
      {showResults && (
        <div className="m-3 rounded-md border border-gray-200 bg-success_light p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className="h-5 w-5 text-success_dark"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              {!error ? (
                <>
                  <div className="mt-2 text-sm">
                    <ul>
                      {results.map((result, idx) => (
                        <li key={idx}>{JSON.stringify(result)}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <h3 className="text-sm font-medium">Error: {error}</h3>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
