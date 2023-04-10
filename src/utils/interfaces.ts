export interface HuggingFaceModelResult {
  label?: string;
  score?: number;
  error?: string;
}

export interface InputTextResultScore {
  gpt: number;
  human: number;
}

export interface Metrics {
  coherence?: number;
  repetition?: number;
  personalStyle?: number;
  originality?: number;
}

export interface InputTextResult {
  id: string;
  score: InputTextResultScore;
  metrics: Metrics;
  text: string;
  details: string[];
  message?: string; // N.B. Not sure if this is needed.
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
