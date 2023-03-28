import { AppContextProps } from 'src/utils/interfaces';
import { createContext, useState } from 'react';

export const AppContext = createContext<AppContextProps>({
  isLoading: false,
  setIsLoading: () => {},
  result: {},
  setResult: () => {},
  error: '',
  setError: () => {},
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({});
  const [error, setError] = useState('');

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        result,
        setResult,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
