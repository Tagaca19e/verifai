import React, { useContext } from 'react';
import ResultMetricsLoader from './loaders/ResultMetricsLoader';
import { AppContext } from './AppContextProvider';
import { AppContextProps, UserDocument } from 'src/utils/interfaces';
import MetricCard from './MetricCard';

export default function TextMetrics({
  userDocument,
}: {
  userDocument: UserDocument;
}) {
  const { isLoading } = useContext<AppContextProps>(AppContext);
  const metrics = userDocument.rating.metrics;

  return (
    <div className="sticky top-0 ml-1 flex-grow border-l border-gray-200 shadow-md">
      {isLoading ? (
        <ResultMetricsLoader />
      ) : (
        <>
          <div className="m-3 rounded-md border border-gray-300 p-3">
            <h2 className="text-gray-700">
              {userDocument.rating.gpt ? userDocument.rating.gpt.toFixed(2) : 0}{' '}
              %
            </h2>
            <h1>Overall score</h1>
          </div>
          <div className="m-3">
            <h1 className="rounded-md border border-gray-300 p-3 text-base text-gray-800 font-semibold">
              Metrics
            </h1>
            <ul className="p-3">
              <MetricCard name="Coherence" value={metrics.coherence || 0} />
              <MetricCard name="Repetition" value={metrics.repetition || 0} />
              <MetricCard
                name="Personal Style"
                value={metrics.personality || 0}
              />
              <MetricCard name="Originality" value={metrics.originality || 0} />
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
