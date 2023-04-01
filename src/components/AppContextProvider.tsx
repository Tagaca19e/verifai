import { AppContextProps, InputTextResult } from 'src/utils/interfaces';
import { createContext, useState, useMemo } from 'react';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<InputTextResult[]>([]);
  const [error, setError] = useState<string>('');

  const contextValue = useMemo(() => {
    return {
      isLoading,
      setIsLoading,
      results,
      setResults,
      error,
      setError,
    };
  }, [isLoading, setIsLoading, results, setResults, error, setError]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
