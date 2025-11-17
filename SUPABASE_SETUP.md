# Supabase Setup Instructions

## Step 1: Create Tables in Supabase

1. Go to your Supabase project at https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the following SQL:

```sql
-- Create players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create match_days table
CREATE TABLE match_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  participants TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1 TEXT NOT NULL,
  player2 TEXT NOT NULL,
  player1_score INTEGER NOT NULL,
  player2_score INTEGER NOT NULL,
  winner TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  match_day_id UUID NOT NULL REFERENCES match_days(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_matches_match_day_id ON matches(match_day_id);
CREATE INDEX idx_matches_date ON matches(date DESC);
CREATE INDEX idx_match_days_date ON match_days(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write access
-- (You can make these more restrictive later with authentication)
CREATE POLICY "Allow public read access on players" 
  ON players FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Allow public insert access on players" 
  ON players FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow public update access on players" 
  ON players FOR UPDATE 
  TO anon 
  USING (true);

CREATE POLICY "Allow public delete access on players" 
  ON players FOR DELETE 
  TO anon 
  USING (true);

CREATE POLICY "Allow public read access on match_days" 
  ON match_days FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Allow public insert access on match_days" 
  ON match_days FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow public update access on match_days" 
  ON match_days FOR UPDATE 
  TO anon 
  USING (true);

CREATE POLICY "Allow public delete access on match_days" 
  ON match_days FOR DELETE 
  TO anon 
  USING (true);

CREATE POLICY "Allow public read access on matches" 
  ON matches FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Allow public insert access on matches" 
  ON matches FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow public update access on matches" 
  ON matches FOR UPDATE 
  TO anon 
  USING (true);

CREATE POLICY "Allow public delete access on matches" 
  ON matches FOR DELETE 
  TO anon 
  USING (true);
```

5. Click "Run" to execute the SQL

## Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to "Project Settings" (gear icon in left sidebar)
2. Click on "API" in the settings menu
3. You'll see:
   - **Project URL** (something like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key** (a long JWT token)

## Step 3: Create Environment File

1. In your project root, create a file named `.env.local`
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **IMPORTANT**: Never commit `.env.local` to git! It should already be in `.gitignore`

## Step 4: Restart Dev Server

After creating `.env.local`, restart your dev server:

```bash
npm run dev
```

## What's Next?

Once you complete these steps, the app will automatically:
- ✅ Save players, matches, and match days to Supabase
- ✅ Load all data from Supabase
- ✅ Allow multiple users to see the same data in real-time
- ✅ Work on GitHub Pages once deployed

## Migrating Existing Players

If you already have the app running and want to migrate the hardcoded players to the database:

1. After completing the setup above, run this SQL in Supabase SQL Editor:

```sql
-- Insert the original hardcoded players
INSERT INTO players (name) VALUES
  ('Michi'),
  ('Flo'),
  ('Daggi'),
  ('Luki'),
  ('Tommy'),
  ('Max'),
  ('Marlene'),
  ('Jo'),
  ('Jona')
ON CONFLICT (name) DO NOTHING;
```

2. The app will automatically load these players from the database

## Security Note

The current setup allows anyone to read/write data. If you want to add authentication later, you can:
1. Enable Supabase Auth
2. Update the RLS policies to check for authenticated users
3. Add login/signup to your React app
