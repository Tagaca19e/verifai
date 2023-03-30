export interface Result {
  label?: string;
  score?: number;
  error?: string;
}

export interface AppContextProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  results: Result[][];
  setResults: React.Dispatch<React.SetStateAction<Result[][]>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}
