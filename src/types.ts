export interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
}

export interface Match {
  id: string;
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  winner: string;
  date: string;
  matchDayId: string;
}

export interface MatchDay {
  id: string;
  date: string;
  participants: string[];
  matches: string[];
}
