ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS booking_source VARCHAR(20) NOT NULL DEFAULT 'web'
  CHECK (booking_source IN ('web', 'admin'));

CREATE INDEX IF NOT EXISTS idx_bookings_booking_source ON bookings(booking_source);
