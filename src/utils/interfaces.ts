export interface HuggingFaceModelResult {
  label?: string;
  score?: number;
  error?: string;
}

export interface InputTextResultScore {
  gpt: number;
  human: number;
}

export interface InputTextResult {
  score: InputTextResultScore;
  text: string;
  details: string[];
  error?: string;
}

export interface AppContextProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  results: InputTextResult[];
  setResults: React.Dispatch<React.SetStateAction<InputTextResult[]>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export interface UserDocument {
  _id: string;
  owner: string;
  title: string;
  content: string;
  results: InputTextResult[];
}
