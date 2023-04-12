import { InputTextResultScore } from 'src/utils/interfaces';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid';

export default function ResultCard({
  inputTextResultScore,
  inputTextResultDetail,
  inputTextResultError,
}: {
  inputTextResultScore?: InputTextResultScore;
  inputTextResultDetail?: string;
  inputTextResultError?: string;
}) {
  return (
    <div
      className={`m-3 rounded-md border border-gray-200 px-2 py-4  shadow-md hover:bg-gray-100 ${
        (inputTextResultScore &&
          inputTextResultScore.gpt > inputTextResultScore.human) ||
        inputTextResultDetail ||
        inputTextResultError
          ? 'bg-white'
          : 'bg-success_light'
      }`}
    >
      <div className="flex">
        {!inputTextResultDetail && (
          <div className="flex-shrink-0 px-2">
            {(inputTextResultScore &&
              inputTextResultScore.gpt > inputTextResultScore.human) ||
            inputTextResultError ? (
              <ExclamationTriangleIcon
                className="h-5 w-5 text-error_dark"
                aria-hidden="true"
              />
            ) : (
              <CheckCircleIcon
                className="h-5 w-5 text-success_dark"
                aria-hidden="true"
              />
            )}
          </div>
        )}
        <div className="ml-3">
          {inputTextResultScore ? (
            <>
              <h3 className="text-sm font-medium">
                {inputTextResultScore.gpt > inputTextResultScore.human
                  ? 'AI generated'
                  : 'Human generated'}
              </h3>
              <div className="mt-2 text-sm">
                <ul>
                  <li>Human Score: {inputTextResultScore.human.toFixed(5)}</li>
                  <li>AI Score: {inputTextResultScore.gpt.toFixed(5)}</li>
                </ul>
              </div>
            </>
          ) : (
            <span className="flex items-center">
              {' '}
              <svg
                className="-ml-0.5 mr-3 h-2 w-2 text-error_dark"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx={4} cy={4} r={3} />
              </svg>
              {inputTextResultDetail || inputTextResultError}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
