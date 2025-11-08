import { useState } from "react";
import type { Match } from "../types";

interface MatchFormProps {
  onAddMatch: (match: Omit<Match, "id" | "date" | "matchDayId">) => void;
  participants: string[];
}

export const MatchForm = ({ onAddMatch, participants }: MatchFormProps) => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!player1 || !player2 || !player1Score || !player2Score) return;

    const score1 = parseInt(player1Score);
    const score2 = parseInt(player2Score);

    if (score1 === score2) {
      alert("Scores cannot be equal!");
      return;
    }

    if (player1 === player2) {
      alert("Players must be different!");
      return;
    }

    const winner = score1 > score2 ? player1 : player2;

    onAddMatch({
      player1,
      player2,
      player1Score: score1,
      player2Score: score2,
      winner,
    });

    setPlayer1("");
    setPlayer2("");
    setPlayer1Score("");
    setPlayer2Score("");
  };

  if (participants.length === 0) {
    return (
      <div className="neon-card">
        <h2 className="neon-text mb-6 text-3xl font-bold tracking-wider text-cyan-400">
          ADD NEW MATCH
        </h2>
        <div className="py-8 text-center text-gray-400">
          <p className="mb-2 text-lg">🎮</p>
          <p>Please create a Match Day first to add matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="neon-card animate-glow">
      <h2 className="neon-text mb-6 text-3xl font-bold tracking-wider text-cyan-400">
        ADD NEW MATCH
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block font-bold tracking-wide text-pink-400">
              PLAYER 1
            </label>
            <select
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="retro-input"
              required
            >
              <option value="">Select player...</option>
              {participants.map((participant) => (
                <option key={participant} value={participant}>
                  {participant}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block font-bold tracking-wide text-pink-400">
              SCORE
            </label>
            <input
              type="number"
              value={player1Score}
              onChange={(e) => setPlayer1Score(e.target.value)}
              className="retro-input"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block font-bold tracking-wide text-pink-400">
              PLAYER 2
            </label>
            <select
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="retro-input"
              required
            >
              <option value="">Select player...</option>
              {participants.map((participant) => (
                <option key={participant} value={participant}>
                  {participant}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block font-bold tracking-wide text-pink-400">
              SCORE
            </label>
            <input
              type="number"
              value={player2Score}
              onChange={(e) => setPlayer2Score(e.target.value)}
              className="retro-input"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="retro-button animate-pulse-slow w-full"
        >
          <span className="text-xl font-bold tracking-widest">
            SUBMIT MATCH
          </span>
        </button>
      </form>
    </div>
  );
};
