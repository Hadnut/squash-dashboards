/* eslint-disable @typescript-eslint/no-explicit-any */

import { supabase } from '../lib/supabase';
import type { Match, MatchDay } from '../types';

// ==================== Players ====================

export const fetchPlayers = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching players:', error);
    throw error;
  }

  if (!data) return [];

  return data.map((row: any) => row.name);
};

export const createPlayer = async (name: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('players')
    .insert({ name });

  if (error) {
    console.error('Error creating player:', error);
    throw error;
  }
};

export const deletePlayer = async (name: string): Promise<void> => {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('name', name);

  if (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};

export const subscribeToPlayers = (callback: () => void) => {
  const channel = supabase
    .channel('players_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players' },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ==================== Match Days ====================

export const fetchMatchDays = async (): Promise<MatchDay[]> => {
  const { data, error } = await supabase
    .from('match_days')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching match days:', error);
    throw error;
  }

  if (!data) return [];

  return (data as any[]).map((row: any) => ({
    id: row.id,
    date: row.date,
    participants: row.participants,
    matches: [], // Will be populated by fetching matches separately
  }));
};

export const createMatchDay = async (participants: string[]): Promise<MatchDay> => {
  const newMatchDay = {
    date: new Date().toISOString(),
    participants,
  };

  const { data, error } = await (supabase as any)
    .from('match_days')
    .insert(newMatchDay)
    .select()
    .single();

  if (error) {
    console.error('Error creating match day:', error);
    throw error;
  }

  if (!data) throw new Error('No data returned from insert');

  return {
    id: data.id,
    date: data.date,
    participants: data.participants,
    matches: [],
  };
};

export const deleteMatchDay = async (matchDayId: string): Promise<void> => {
  const { error } = await supabase
    .from('match_days')
    .delete()
    .eq('id', matchDayId);

  if (error) {
    console.error('Error deleting match day:', error);
    throw error;
  }
};

// ==================== Matches ====================

export const fetchMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }

  if (!data) return [];

  return (data as any[]).map((row: any) => ({
    id: row.id,
    player1: row.player1,
    player2: row.player2,
    player1Score: row.player1_score,
    player2Score: row.player2_score,
    winner: row.winner,
    date: row.date,
    matchDayId: row.match_day_id,
  }));
};

export const fetchMatchesByMatchDay = async (matchDayId: string): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('match_day_id', matchDayId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching matches by match day:', error);
    throw error;
  }

  if (!data) return [];

  return (data as any[]).map((row: any) => ({
    id: row.id,
    player1: row.player1,
    player2: row.player2,
    player1Score: row.player1_score,
    player2Score: row.player2_score,
    winner: row.winner,
    date: row.date,
    matchDayId: row.match_day_id,
  }));
};

export const createMatch = async (
  matchData: Omit<Match, 'id' | 'date' | 'matchDayId'>,
  matchDayId: string
): Promise<Match> => {
  const newMatch = {
    player1: matchData.player1,
    player2: matchData.player2,
    player1_score: matchData.player1Score,
    player2_score: matchData.player2Score,
    winner: matchData.winner,
    date: new Date().toISOString(),
    match_day_id: matchDayId,
  };

  const { data, error } = await (supabase as any)
    .from('matches')
    .insert(newMatch)
    .select()
    .single();

  if (error) {
    console.error('Error creating match:', error);
    throw error;
  }

  if (!data) throw new Error('No data returned from insert');

  return {
    id: data.id,
    player1: data.player1,
    player2: data.player2,
    player1Score: data.player1_score,
    player2Score: data.player2_score,
    winner: data.winner,
    date: data.date,
    matchDayId: data.match_day_id,
  };
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', matchId);

  if (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};

// ==================== Real-time Subscriptions ====================

export const subscribeToMatchDays = (callback: () => void) => {
  const channel = supabase
    .channel('match_days_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'match_days' },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToMatches = (callback: () => void) => {
  const channel = supabase
    .channel('matches_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'matches' },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
