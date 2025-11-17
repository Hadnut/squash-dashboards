import { useState, useEffect } from "react";
import { fetchPlayers, createPlayer, deletePlayer, subscribeToPlayers } from "../services/database";

export const PlayerManagement = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
    const unsubscribe = subscribeToPlayers(() => {
      loadPlayers();
    });
    return unsubscribe;
  }, []);

  const loadPlayers = async () => {
    try {
      const data = await fetchPlayers();
      setPlayers(data);
    } catch (err) {
      console.error("Failed to load players:", err);
      setError("Failed to load players");
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newPlayerName.trim();
    
    if (!trimmedName) {
      setError("Player name cannot be empty");
      return;
    }

    if (players.includes(trimmedName)) {
      setError("Player already exists");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createPlayer(trimmedName);
      setNewPlayerName("");
      await loadPlayers();
    } catch (err) {
      console.error("Failed to add player:", err);
      setError("Failed to add player");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlayer = async (name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deletePlayer(name);
      await loadPlayers();
    } catch (err) {
      console.error("Failed to delete player:", err);
      setError("Failed to delete player");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="neon-card animate-glow">
        <h2 className="neon-text mb-6 text-3xl font-bold tracking-wider text-cyan-400">
          PLAYER MANAGEMENT
        </h2>

        <div className="mb-6 rounded-lg border border-cyan-500/50 bg-cyan-900/20 p-4">
          <p className="text-cyan-300">
            Manage your squad here. Add new players or remove inactive ones.
            Changes sync instantly across all users.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-900/30 p-3 text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleAddPlayer} className="mb-8 space-y-3">
          <label className="block font-bold tracking-wide text-pink-400">
            ADD NEW PLAYER
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name..."
              className="retro-input flex-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="rounded-lg border-2 border-cyan-400 bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-3 font-bold tracking-wider text-cyan-300 transition-all duration-300 hover:border-pink-400 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50"
              style={{
                boxShadow: "0 0 20px rgba(255, 20, 147, 0.6), 0 0 40px rgba(138, 43, 226, 0.3)"
              }}
              disabled={isLoading}
            >
              ✚ ADD
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <div className="mb-4 flex items-center justify-between border-b border-cyan-500/30 pb-3">
            <h3 className="text-xl font-bold text-pink-400">
              ACTIVE PLAYERS ({players.length})
            </h3>
          </div>
          
          {players.length === 0 ? (
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-900/10 p-8 text-center">
              <div className="mb-2 text-4xl">🎾</div>
              <div className="text-lg text-cyan-400">No players yet. Add your first player above!</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {players.map((player, index) => (
                <div
                  key={player}
                  className="group flex items-center justify-between rounded-lg border-2 border-cyan-500/30 bg-cyan-900/10 px-4 py-4 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-900/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-pink-400 bg-pink-500/20 font-bold text-pink-300">
                      {index + 1}
                    </div>
                    <span className="text-lg font-bold tracking-wide text-cyan-300">
                      {player}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePlayer(player)}
                    className="rounded border border-red-400 bg-red-600/50 px-4 py-2 text-sm font-bold text-red-300 transition-all hover:bg-red-600/70 group-hover:scale-105"
                    disabled={isLoading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
