CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS service_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  duration_minutes INT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, name)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  user_type VARCHAR(30) NOT NULL CHECK (user_type IN ('super_admin', 'operation_team', 'technician', 'customer')),
  role VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked')),
  email_verified_at TIMESTAMPTZ,
  phone VARCHAR(30),
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address VARCHAR(45),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  user_type VARCHAR(30) NOT NULL CHECK (user_type IN ('operation_team', 'technician')),
  role VARCHAR(30) NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  otp_hash VARCHAR(255) NOT NULL,
  otp_expires_at TIMESTAMPTZ NOT NULL,
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  otp_hash VARCHAR(255) NOT NULL,
  otp_expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technician_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  years_experience INT NOT NULL DEFAULT 0,
  bio TEXT,
  certifications TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technician_expertise (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_tokens(user_id);

CREATE TABLE IF NOT EXISTS service_locations (
  id SERIAL PRIMARY KEY,
  region VARCHAR(20) NOT NULL CHECK (region IN ('gta', 'nearby')),
  name VARCHAR(120) NOT NULL,
  parent_id INT REFERENCES service_locations(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_service_locations_region_root_name
  ON service_locations (region, name)
  WHERE parent_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_service_locations_parent_name
  ON service_locations (parent_id, name)
  WHERE parent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_service_locations_region ON service_locations(region);
CREATE INDEX IF NOT EXISTS idx_service_locations_parent_id ON service_locations(parent_id);

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
CREATE INDEX IF NOT EXISTS idx_bookings_client_email ON bookings(client_email);

CREATE TABLE IF NOT EXISTS booking_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  start_hour SMALLINT NOT NULL DEFAULT 8 CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour SMALLINT NOT NULL DEFAULT 18 CHECK (end_hour >= 1 AND end_hour <= 24),
  lookahead_days INT NOT NULL DEFAULT 30 CHECK (lookahead_days >= 1 AND lookahead_days <= 365),
  timezone VARCHAR(64) NOT NULL DEFAULT 'America/Toronto',
  working_days JSONB NOT NULL DEFAULT '[1,2,3,4,5]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
