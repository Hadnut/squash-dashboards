import type { Match, Player } from "../types";

interface DashboardProps {
  players: Player[];
  matches: Match[];
}

export const Dashboard = ({ players, matches }: DashboardProps) => {
  const totalMatches = matches.length;
  const totalPlayers = players.length;
  const topPlayer =
    players.length > 0
      ? [...players].sort((a, b) => b.winRate - a.winRate)[0]
      : null;
  const avgScoreDiff =
    matches.length > 0
      ? matches.reduce(
          (sum, match) =>
            sum + Math.abs(match.player1Score - match.player2Score),
          0
        ) / matches.length
      : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="stat-card stat-card-cyan animate-float">
        <div className="stat-icon">🎮</div>
        <div className="stat-value">{totalMatches}</div>
        <div className="stat-label">TOTAL MATCHES</div>
      </div>

      <div
        className="stat-card stat-card-pink animate-float"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="stat-icon">👥</div>
        <div className="stat-value">{totalPlayers}</div>
        <div className="stat-label">ACTIVE PLAYERS</div>
      </div>

      <div
        className="stat-card stat-card-yellow animate-float"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="stat-icon">🏆</div>
        <div className="stat-value text-2xl">{topPlayer?.name || "—"}</div>
        <div className="stat-label">TOP PLAYER</div>
      </div>

      <div
        className="stat-card stat-card-green animate-float"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="stat-icon">📊</div>
        <div className="stat-value">{avgScoreDiff.toFixed(1)}</div>
        <div className="stat-label">AVG SCORE DIFF</div>
      </div>
    </div>
  );
};
