-- Create table for storing test results
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  group_name TEXT NOT NULL,
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  language TEXT NOT NULL CHECK (language IN ('ru', 'kz')),
  variant INTEGER NOT NULL CHECK (variant >= 1 AND variant <= 12),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 25),
  total_questions INTEGER NOT NULL DEFAULT 25,
  percentage DECIMAL(5,2) NOT NULL,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_group ON test_results(group_name);

-- Enable RLS
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert results (no auth required for this app)
CREATE POLICY "Allow public insert" ON test_results FOR INSERT WITH CHECK (true);

-- Allow anyone to select results (for admin viewing)
CREATE POLICY "Allow public select" ON test_results FOR SELECT USING (true);
