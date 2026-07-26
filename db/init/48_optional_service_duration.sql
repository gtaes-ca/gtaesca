-- Allow catalog services without a booking duration (e.g. quote-only / inquiry services).
ALTER TABLE services
  ALTER COLUMN duration_minutes DROP NOT NULL,
  ALTER COLUMN duration_minutes DROP DEFAULT;
