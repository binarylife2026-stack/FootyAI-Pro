
export interface PredictionItem {
  marketName: string;
  probability: number;
  explanation: string;
}

export interface PredictionCategory {
  title: string;
  items: PredictionItem[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResponse {
  homeTeam: string;
  awayTeam: string;
  categories: PredictionCategory[];
  sources?: GroundingSource[];
}

export interface MatchInput {
  homeTeam: string;
  awayTeam: string;
  league?: string;
}
