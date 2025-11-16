import { useState, useEffect } from "react";
import type { Match, Player, MatchDay } from "./types";
import { MatchForm } from "./components/MatchForm";
import { MatchDayForm } from "./components/MatchDayForm";
import { MatchDayList } from "./components/MatchDayList";
import { Leaderboard } from "./components/Leaderboard";
import { Dashboard } from "./components/Dashboard";
import { RecentMatches } from "./components/RecentMatches";
import { PongAnimation } from "./components/PongAnimation";
import {
  fetchMatches,
  fetchMatchDays,
  createMatch,
  createMatchDay,
  deleteMatch,
  deleteMatchDay,
  subscribeToMatches,
  subscribeToMatchDays,
} from "./services/database";

function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchDays, setMatchDays] = useState<MatchDay[]>([]);
  const [currentMatchDayId, setCurrentMatchDayId] = useState<string | null>(
    () => {
      const saved = localStorage.getItem("squash-current-matchday");
      return saved || null;
    }
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [matchesData, matchDaysData] = await Promise.all([
          fetchMatches(),
          fetchMatchDays(),
        ]);
        
        // Populate match IDs for each match day
        const matchDaysWithMatches = matchDaysData.map(md => ({
          ...md,
          matches: matchesData
            .filter(m => m.matchDayId === md.id)
            .map(m => m.id),
        }));
        
        setMatches(matchesData);
        setMatchDays(matchDaysWithMatches);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please check your Supabase configuration.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time changes
    const unsubscribeMatches = subscribeToMatches(() => {
      fetchMatches().then(setMatches);
    });

    const unsubscribeMatchDays = subscribeToMatchDays(() => {
      fetchMatchDays().then(data => {
        const matchDaysWithMatches = data.map(md => ({
          ...md,
          matches: matches.filter(m => m.matchDayId === md.id).map(m => m.id),
        }));
        setMatchDays(matchDaysWithMatches);
      });
    });

    return () => {
      unsubscribeMatches();
      unsubscribeMatchDays();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update player stats when matches change
  useEffect(() => {
    if (currentMatchDayId) {
      localStorage.setItem("squash-current-matchday", currentMatchDayId);
    } else {
      localStorage.removeItem("squash-current-matchday");
    }
    
    const updatePlayerStats = () => {
      const playerMap = new Map<string, Player>();
      const matchesToAnalyze = currentMatchDayId
        ? matches.filter((m) => m.matchDayId === currentMatchDayId)
        : matches;

      matchesToAnalyze.forEach((match) => {
        [match.player1, match.player2].forEach((playerName) => {
          if (!playerMap.has(playerName)) {
            playerMap.set(playerName, {
              id: playerName,
              name: playerName,
              wins: 0,
              losses: 0,
              totalGames: 0,
              winRate: 0,
            });
          }
        });

        const player1Data = playerMap.get(match.player1)!;
        const player2Data = playerMap.get(match.player2)!;

        player1Data.totalGames++;
        player2Data.totalGames++;

        if (match.winner === match.player1) {
          player1Data.wins++;
          player2Data.losses++;
        } else {
          player2Data.wins++;
          player1Data.losses++;
        }

        player1Data.winRate = (player1Data.wins / player1Data.totalGames) * 100;
        player2Data.winRate = (player2Data.wins / player2Data.totalGames) * 100;
      });

      setPlayers(Array.from(playerMap.values()));
    };
    
    updatePlayerStats();
  }, [matches, currentMatchDayId]);

  const currentMatchDay = matchDays.find((md) => md.id === currentMatchDayId);
  const filteredMatches = currentMatchDayId
    ? matches.filter((m) => m.matchDayId === currentMatchDayId)
    : matches;

  const handleAddMatchDay = async (participants: string[]) => {
    try {
      const newMatchDay = await createMatchDay(participants);
      setMatchDays([...matchDays, newMatchDay]);
      setCurrentMatchDayId(newMatchDay.id);
    } catch (err) {
      console.error("Error creating match day:", err);
      alert("Failed to create match day. Please try again.");
    }
  };

  const handleAddMatch = async (
    matchData: Omit<Match, "id" | "date" | "matchDayId">
  ) => {
    if (!currentMatchDayId) {
      alert("Please select or create a Match Day first!");
      return;
    }

    try {
      const newMatch = await createMatch(matchData, currentMatchDayId);
      setMatches([...matches, newMatch]);

      const updatedMatchDays = matchDays.map((md) =>
        md.id === currentMatchDayId
          ? { ...md, matches: [...md.matches, newMatch.id] }
          : md
      );
      setMatchDays(updatedMatchDays);
    } catch (err) {
      console.error("Error creating match:", err);
      alert("Failed to create match. Please try again.");
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (match) {
      try {
        await deleteMatch(matchId);
        setMatches(matches.filter((m) => m.id !== matchId));
        const updatedMatchDays = matchDays.map((md) =>
          md.id === match.matchDayId
            ? { ...md, matches: md.matches.filter((id) => id !== matchId) }
            : md
        );
        setMatchDays(updatedMatchDays);
      } catch (err) {
        console.error("Error deleting match:", err);
        alert("Failed to delete match. Please try again.");
      }
    }
  };

  const handleDeleteMatchDay = async (matchDayId: string) => {
    try {
      await deleteMatchDay(matchDayId);
      // Remove matches from this match day
      setMatches(matches.filter((m) => m.matchDayId !== matchDayId));
      // Remove the match day
      setMatchDays(matchDays.filter((md) => md.id !== matchDayId));
      // If the deleted match day was active, switch to all-time view
      if (currentMatchDayId === matchDayId) {
        setCurrentMatchDayId(null);
      }
    } catch (err) {
      console.error("Error deleting match day:", err);
      alert("Failed to delete match day. Please try again.");
    }
  };

  const handleSelectMatchDay = (matchDayId: string | null) => {
    setCurrentMatchDayId(matchDayId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="neon-text-main text-4xl font-bold mb-4">LOADING</div>
          <div className="animate-pulse text-cyan-400">Connecting to database...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="neon-text-main text-4xl font-bold mb-4">ERROR</div>
          <div className="text-red-400 mb-4">{error}</div>
          <div className="text-cyan-400 text-sm">
            Please check SUPABASE_SETUP.md for configuration instructions.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="cyber-grid"></div>

      <div className="container relative z-10 mx-auto px-4 py-8">
        <header className="animate-slide-down relative mb-12 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <PongAnimation />
          </div>
          
          <div className="laser-container">
            <div className="laser-beam laser-beam-1"></div>
            <div className="laser-beam laser-beam-2"></div>
            <div className="laser-beam laser-beam-3"></div>
          </div>

          <h1 className="neon-text-main relative z-10 mb-4 text-6xl font-bold tracking-wider md:text-8xl">
            SQUASH
          </h1>
          <h2 className="neon-text-pink relative z-10 text-3xl font-bold tracking-widest text-pink-500 md:text-5xl">
            UNLIMITED 2025 - 2026
          </h2>
          
          <div className="animate-pulse-glow relative z-10 mt-4 text-sm tracking-[0.3em] text-cyan-400">
            ▸ GAME ON ◂
          </div>

          <div className="particles-container">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>
          </div>

          {currentMatchDay && (
            <div className="animate-border-glow relative z-10 mt-4 inline-block rounded-lg border-2 border-pink-400 bg-pink-500/20 px-6 py-2">
              <span className="font-bold tracking-wider text-pink-400">
                📅 ACTIVE:{" "}
                {new Date(currentMatchDay.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </header>

        <Dashboard players={players} matches={filteredMatches} />

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <MatchDayForm
            onAddMatchDay={handleAddMatchDay}
            matchDays={matchDays}
          />
          <MatchDayList
            matchDays={matchDays}
            currentMatchDayId={currentMatchDayId}
            onSelectMatchDay={handleSelectMatchDay}
            onDeleteMatchDay={handleDeleteMatchDay}
          />
          <MatchForm
            onAddMatch={handleAddMatch}
            participants={currentMatchDay?.participants || []}
          />
        </div>

        <div className="mb-8">
          <RecentMatches
            matches={filteredMatches}
            onDeleteMatch={handleDeleteMatch}
          />
        </div>

        <Leaderboard players={players} />
      </div>

      <div className="scanline"></div>
    </div>
  );
}

export default App;
