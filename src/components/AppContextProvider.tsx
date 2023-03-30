import { AppContextProps } from 'src/utils/interfaces';
import { createContext, useState } from 'react';
import { Result } from 'src/utils/interfaces';

export const AppContext = createContext<AppContextProps>({
  isLoading: false,
  setIsLoading: () => {},
  results: [],
  setResults: () => {},
  error: '',
  setError: () => {},
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Result[][]>([]);
  const [error, setError] = useState('');

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        results,
        setResults,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
