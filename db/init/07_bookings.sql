CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code VARCHAR(24) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'technician_assigned', 'completed', 'cancelled')),
  service_id INT NOT NULL REFERENCES services(id),
  service_location_id INT NOT NULL REFERENCES service_locations(id),
  technician_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 120,
  service_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (service_price >= 0),
  client_first_name VARCHAR(100) NOT NULL,
  client_last_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(30),
  client_address TEXT,
  notes TEXT,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_technician_user_id ON bookings(technician_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_email ON bookings(client_email);
