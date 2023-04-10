import React, { useContext } from 'react';
import { AppContext } from './AppContextProvider';
import { AppContextProps } from 'src/utils/interfaces';

export default function TextMetrics() {
  const { results, isLoading } = useContext<AppContextProps>(AppContext);

  let coherence = 0;
  let repetition = 0;
  let personalStyle = 0;
  let originality = 0;
  let errors = 0;

  for (let result of results) {
    if (Object.keys(result.metrics).length) {
      errors += 1;
      coherence += result.metrics.coherence || 0;
      repetition += result.metrics.repetition || 0;
      personalStyle += result.metrics.personalStyle || 0;
      originality += result.metrics.originality || 0;
    }
  }

  return (
    <div className="w-64">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <h1>Overall score</h1>
            <h2>91%</h2>
          </div>
          <div>
            <h1>Metrics</h1>
            <ul>
              <li>Coherence: {coherence / errors}</li>
              <li>Repetition: {repetition / errors}</li>
              <li>Personal style: {personalStyle / errors}</li>
              <li>Originality: {originality / errors}</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
