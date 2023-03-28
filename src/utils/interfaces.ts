export interface Result {
  [key: string]: number;
}

export interface AppContextProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  result: Result;
  setResult: React.Dispatch<React.SetStateAction<Result>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}
