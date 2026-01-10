CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Images table
-- Stores both original and processed image metadata
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Original uploaded file
  original_filename TEXT NOT NULL,
  original_storage_path TEXT,
  original_public_url TEXT,

  -- Processed (background-removed + flipped) file
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering by newest first
CREATE INDEX idx_images_created_at
  ON images (created_at DESC);

-- Enable Row Level Security
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "Allow all operations"
  ON images
  FOR ALL
  USING (true)
  WITH CHECK (true);
