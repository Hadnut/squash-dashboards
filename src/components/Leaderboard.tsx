import type { Player } from "../types";

interface LeaderboardProps {
  players: Player[];
}

export const Leaderboard = ({ players }: LeaderboardProps) => {
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return b.wins - a.wins;
  });

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="neon-card animate-slide-up">
      <h2 className="neon-text mb-6 text-3xl font-bold tracking-wider text-cyan-400">
        LEADERBOARD
      </h2>
      <div className="overflow-x-auto">
        <table className="retro-table w-full">
          <thead>
            <tr className="border-b-2 border-cyan-500">
              <th className="px-4 py-3 text-left text-pink-400">RANK</th>
              <th className="px-4 py-3 text-left text-pink-400">PLAYER</th>
              <th className="px-4 py-3 text-center text-pink-400">WINS</th>
              <th className="px-4 py-3 text-center text-pink-400">LOSSES</th>
              <th className="px-4 py-3 text-center text-pink-400">GAMES</th>
              <th className="px-4 py-3 text-center text-pink-400">WIN RATE</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-lg text-gray-400"
                >
                  No players yet. Add your first match!
                </td>
              </tr>
            ) : (
              sortedPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  className="border-b border-cyan-800/30 transition-all duration-300 hover:bg-cyan-900/20"
                >
                  <td className="px-4 py-4">
                    <span className="text-2xl">{getMedalEmoji(index)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xl font-bold ${
                        index === 0
                          ? "neon-text-yellow text-yellow-400"
                          : index === 1
                            ? "text-gray-300"
                            : index === 2
                              ? "text-orange-400"
                              : "text-cyan-300"
                      }`}
                    >
                      {player.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-green-400">
                    {player.wins}
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-red-400">
                    {player.losses}
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-cyan-300">
                    {player.totalGames}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xl font-bold text-pink-400">
                      {player.winRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
