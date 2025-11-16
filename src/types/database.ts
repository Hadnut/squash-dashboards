export interface Database {
  public: {
    Tables: {
      match_days: {
        Row: {
          id: string;
          date: string;
          participants: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          participants: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          participants?: string[];
          created_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          player1: string;
          player2: string;
          player1_score: number;
          player2_score: number;
          winner: string;
          date: string;
          match_day_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player1: string;
          player2: string;
          player1_score: number;
          player2_score: number;
          winner: string;
          date: string;
          match_day_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player1?: string;
          player2?: string;
          player1_score?: number;
          player2_score?: number;
          winner?: string;
          date?: string;
          match_day_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
