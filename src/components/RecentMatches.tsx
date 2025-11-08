import type { Match } from "../types";

interface RecentMatchesProps {
  matches: Match[];
  onDeleteMatch: (matchId: string) => void;
}

export const RecentMatches = ({
  matches,
  onDeleteMatch,
}: RecentMatchesProps) => {
  const recentMatches = [...matches].reverse().slice(0, 10);

  return (
    <div
      className="neon-card animate-slide-up"
      style={{ animationDelay: "0.2s" }}
    >
      <h2 className="neon-text mb-6 text-3xl font-bold tracking-wider text-cyan-400">
        RECENT MATCHES
      </h2>
      <div className="space-y-3">
        {recentMatches.length === 0 ? (
          <p className="py-8 text-center text-lg text-gray-400">
            No matches recorded yet
          </p>
        ) : (
          recentMatches.map((match, index) => (
            <div
              key={match.id}
              className="match-card animate-fade-in group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span
                    className={`text-lg font-bold ${
                      match.winner === match.player1
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {match.player1}
                  </span>
                </div>
                <div className="flex items-center gap-4 px-6">
                  <span
                    className={`text-2xl font-bold ${
                      match.winner === match.player1
                        ? "neon-text-green text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {match.player1Score}
                  </span>
                  <span className="text-xl font-bold text-pink-500">VS</span>
                  <span
                    className={`text-2xl font-bold ${
                      match.winner === match.player2
                        ? "neon-text-green text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {match.player2Score}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-end gap-3 text-right">
                  <span
                    className={`text-lg font-bold ${
                      match.winner === match.player2
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {match.player2}
                  </span>
                  <button
                    onClick={() => onDeleteMatch(match.id)}
                    className="delete-button opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    title="Delete match"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-cyan-500">
                {new Date(match.date).toLocaleDateString()} -{" "}
                {new Date(match.date).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
