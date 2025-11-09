import { useState, useEffect } from "react";
import type { Match, Player, MatchDay } from "./types";
import { MatchForm } from "./components/MatchForm";
import { MatchDayForm } from "./components/MatchDayForm";
import { MatchDayList } from "./components/MatchDayList";
import { Leaderboard } from "./components/Leaderboard";
import { Dashboard } from "./components/Dashboard";
import { RecentMatches } from "./components/RecentMatches";
import { PongAnimation } from "./components/PongAnimation";

function App() {
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem("squash-matches");
    return saved ? JSON.parse(saved) : [];
  });

  const [matchDays, setMatchDays] = useState<MatchDay[]>(() => {
    const saved = localStorage.getItem("squash-matchdays");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentMatchDayId, setCurrentMatchDayId] = useState<string | null>(
    () => {
      const saved = localStorage.getItem("squash-current-matchday");
      return saved || null;
    }
  );

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    localStorage.setItem("squash-matches", JSON.stringify(matches));
    localStorage.setItem("squash-matchdays", JSON.stringify(matchDays));
    if (currentMatchDayId) {
      localStorage.setItem("squash-current-matchday", currentMatchDayId);
    } else {
      localStorage.removeItem("squash-current-matchday");
    }
    updatePlayerStats();
  }, [matches, matchDays, currentMatchDayId]);

  const currentMatchDay = matchDays.find((md) => md.id === currentMatchDayId);
  const filteredMatches = currentMatchDayId
    ? matches.filter((m) => m.matchDayId === currentMatchDayId)
    : matches;

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

  const handleAddMatchDay = (participants: string[]) => {
    const newMatchDay: MatchDay = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      participants,
      matches: [],
    };
    setMatchDays([...matchDays, newMatchDay]);
    setCurrentMatchDayId(newMatchDay.id);
  };

  const handleAddMatch = (
    matchData: Omit<Match, "id" | "date" | "matchDayId">
  ) => {
    if (!currentMatchDayId) {
      alert("Please select or create a Match Day first!");
      return;
    }

    const newMatch: Match = {
      ...matchData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      matchDayId: currentMatchDayId,
    };

    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);

    const updatedMatchDays = matchDays.map((md) =>
      md.id === currentMatchDayId
        ? { ...md, matches: [...md.matches, newMatch.id] }
        : md
    );
    setMatchDays(updatedMatchDays);
  };

  const handleDeleteMatch = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (match) {
      setMatches(matches.filter((m) => m.id !== matchId));
      const updatedMatchDays = matchDays.map((md) =>
        md.id === match.matchDayId
          ? { ...md, matches: md.matches.filter((id) => id !== matchId) }
          : md
      );
      setMatchDays(updatedMatchDays);
    }
  };

  const handleDeleteMatchDay = (matchDayId: string) => {
    // Delete all matches from this match day
    setMatches(matches.filter((m) => m.matchDayId !== matchDayId));
    // Delete the match day
    setMatchDays(matchDays.filter((md) => md.id !== matchDayId));
    // If the deleted match day was active, switch to all-time view
    if (currentMatchDayId === matchDayId) {
      setCurrentMatchDayId(null);
    }
  };

  const handleSelectMatchDay = (matchDayId: string | null) => {
    setCurrentMatchDayId(matchDayId);
  };

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
