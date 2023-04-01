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
      className={`m-3 rounded-md border border-gray-200 ${
        (inputTextResultScore &&
          inputTextResultScore.gpt > inputTextResultScore.human) ||
        inputTextResultDetail ||
        inputTextResultError
          ? 'bg-error_light'
          : 'bg-success_light'
      } p-4`}
    >
      <div className="flex">
        {!inputTextResultDetail && (
          <div className="flex-shrink-0">
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
            <p>{inputTextResultDetail || inputTextResultError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
