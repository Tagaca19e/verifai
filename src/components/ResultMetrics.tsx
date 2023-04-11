import React, { useContext } from 'react';
import { AppContext } from './AppContextProvider';
import { AppContextProps, UserDocument } from 'src/utils/interfaces';

export default function TextMetrics({
  userDocument,
}: {
  userDocument: UserDocument;
}) {
  const { isLoading } = useContext<AppContextProps>(AppContext);
  const metrics = userDocument.rating.metrics;

  return (
    <div className="sticky top-0 w-64 border-l border-gray-200">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="m-3 rounded-md border border-gray-300 p-3">
            <h2>{userDocument.rating.gpt.toFixed(2)}</h2>
            <h1>Overall score</h1>
          </div>
          <div className="m-3">
            <h1 className="rounded-md border border-gray-300 p-3 text-base font-semibold">
              Metrics
            </h1>
            <ul className="p-3">
              {Object.keys(metrics).map((metric) => {
                return (
                  metric !== 'errorTextCount' && (
                    <li key={metric} className="mb-3">
                      <h1 className="capitalize">{metric}</h1>
                      <p> {metrics[metric]} </p>
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
