import { AppContext } from './AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';
import { useContext, useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid';

export default function Result() {
  const { isLoading, result, error } = useContext<AppContextProps>(AppContext);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if ((!isLoading && Object.keys(result).length > 0) || error) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [isLoading, result, error, showResults]);

  return (
    <>
      {showResults && (
        <div
          className={`m-3 rounded-md border border-gray-200 ${
            result.Human > result.ChatGPT && !error
              ? 'bg-success_light'
              : 'bg-error_light'
          }  p-4`}
        >
          {/* {Object.keys(result).length > 0 && !error && ( */}
          <div className="flex">
            <div className="flex-shrink-0">
              {result.Human > result.ChatGPT && !error ? (
                <CheckCircleIcon
                  className="h-5 w-5 text-success_dark"
                  aria-hidden="true"
                />
              ) : (
                <ExclamationTriangleIcon
                  className="h-5 w-5 text-error_dark"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="ml-3">
              {!error ? (
                <>
                  <h3 className="text-sm font-medium">
                    {result.Human > result.ChatGPT
                      ? 'Human Generated!'
                      : 'AI Generated!'}
                  </h3>
                  <div className="mt-2 text-sm ">
                    <ul>
                      <li>Human Score: {result.Human.toFixed(5)}</li>
                      <li>AI Score: {result.ChatGPT.toFixed(5)}</li>
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
