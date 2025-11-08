import { useState } from "react";
import type { MatchDay } from "../types";
import { FIXED_PLAYERS } from "../constants";

interface MatchDayFormProps {
  onAddMatchDay: (participants: string[]) => void;
  matchDays: MatchDay[];
}

export const MatchDayForm = ({
  onAddMatchDay,
  matchDays,
}: MatchDayFormProps) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  const handleToggleParticipant = (name: string) => {
    if (selectedParticipants.includes(name)) {
      setSelectedParticipants(selectedParticipants.filter((p) => p !== name));
    } else {
      setSelectedParticipants([...selectedParticipants, name]);
    }
  };

  const handleSelectAll = () => {
    setSelectedParticipants([...FIXED_PLAYERS]);
  };

  const handleClearAll = () => {
    setSelectedParticipants([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedParticipants.length >= 2) {
      onAddMatchDay(selectedParticipants);
      setSelectedParticipants([]);
    } else {
      alert("Please select at least 2 participants!");
    }
  };

  return (
    <div className="neon-card animate-glow">
      <h2 className="neon-text mb-6 text-3xl font-bold tracking-wider text-cyan-400">
        NEW MATCH DAY
      </h2>

      <div className="mb-4 rounded-lg border border-pink-500/50 bg-purple-900/30 p-3">
        <div className="mb-2 text-sm text-cyan-400">
          📅 Total Match Days:{" "}
          <span className="font-bold text-pink-400">{matchDays.length}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block font-bold tracking-wide text-pink-400">
              SELECT PARTICIPANTS ({selectedParticipants.length})
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="rounded border border-green-400 bg-green-600/50 px-3 py-1 text-xs text-green-300 transition-colors hover:bg-green-600/70"
              >
                All
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded border border-red-400 bg-red-600/50 px-3 py-1 text-xs text-red-300 transition-colors hover:bg-red-600/70"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {FIXED_PLAYERS.map((player) => (
              <button
                key={player}
                type="button"
                onClick={() => handleToggleParticipant(player)}
                className={`rounded-lg border-2 px-4 py-3 font-bold tracking-wide transition-all duration-300 ${
                  selectedParticipants.includes(player)
                    ? "scale-105 border-pink-400 bg-pink-500/30 text-pink-300"
                    : "border-cyan-500/30 bg-cyan-900/10 text-cyan-400 hover:border-cyan-400"
                }`}
              >
                {selectedParticipants.includes(player) && "✓ "}
                {player}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="retro-button animate-pulse-slow w-full"
          disabled={selectedParticipants.length < 2}
        >
          <span className="text-xl font-bold tracking-widest">
            START MATCH DAY
          </span>
        </button>
      </form>
    </div>
  );
};
