import type { MatchDay } from "../types";

interface MatchDayListProps {
  matchDays: MatchDay[];
  currentMatchDayId: string | null;
  onSelectMatchDay: (matchDayId: string | null) => void;
  onDeleteMatchDay: (matchDayId: string) => void;
}

export const MatchDayList = ({
  matchDays,
  currentMatchDayId,
  onSelectMatchDay,
  onDeleteMatchDay,
}: MatchDayListProps) => {
  const sortedMatchDays = [...matchDays].reverse();

  const handleDelete = (e: React.MouseEvent, matchDayId: string) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this match day? All matches from this day will also be deleted."
      )
    ) {
      onDeleteMatchDay(matchDayId);
    }
  };

  return (
    <div
      className="neon-card animate-slide-up"
      style={{ animationDelay: "0.1s" }}
    >
      <h2 className="neon-text mb-6 text-3xl font-bold tracking-wider text-cyan-400">
        MATCH DAYS
      </h2>

      <div className="mb-4">
        <button
          onClick={() => onSelectMatchDay(null)}
          className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all duration-300 ${
            currentMatchDayId === null
              ? "border-yellow-400 bg-yellow-500/20 font-bold text-yellow-300"
              : "border-cyan-500/30 bg-cyan-900/10 text-cyan-300 hover:border-cyan-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg tracking-wide">📊 ALL TIME STATS</span>
            {currentMatchDayId === null && (
              <span className="text-yellow-400">◀ ACTIVE</span>
            )}
          </div>
        </button>
      </div>

      <div className="max-h-96 space-y-3 overflow-y-auto">
        {sortedMatchDays.length === 0 ? (
          <p className="py-8 text-center text-lg text-gray-400">
            No match days yet. Create your first one!
          </p>
        ) : (
          sortedMatchDays.map((matchDay) => (
            <div
              key={matchDay.id}
              className={`group relative rounded-lg border-2 transition-all duration-300 ${
                currentMatchDayId === matchDay.id
                  ? "animate-pulse-slow border-pink-400 bg-pink-500/20 font-bold text-pink-300"
                  : "border-cyan-500/30 bg-cyan-900/10 text-cyan-300 hover:border-cyan-400"
              }`}
            >
              <button
                onClick={() => onSelectMatchDay(matchDay.id)}
                className="w-full px-4 py-3 text-left"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-bold tracking-wide">
                    {new Date(matchDay.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {currentMatchDayId === matchDay.id && (
                    <span className="text-pink-400">◀ ACTIVE</span>
                  )}
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">
                    👥 {matchDay.participants.length} players
                  </span>
                  <span className="text-yellow-400">
                    🎮 {matchDay.matches.length} matches
                  </span>
                </div>
                <div className="mt-2 truncate text-xs text-gray-400">
                  {matchDay.participants.join(", ")}
                </div>
              </button>
              <button
                onClick={(e) => handleDelete(e, matchDay.id)}
                className="delete-button absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                title="Delete match day"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
