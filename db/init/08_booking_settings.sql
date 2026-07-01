ALTER TABLE services
  ADD COLUMN IF NOT EXISTS duration_minutes INT NOT NULL DEFAULT 120;

CREATE TABLE IF NOT EXISTS booking_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  start_hour SMALLINT NOT NULL DEFAULT 8 CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour SMALLINT NOT NULL DEFAULT 18 CHECK (end_hour >= 1 AND end_hour <= 24),
  lookahead_days INT NOT NULL DEFAULT 30 CHECK (lookahead_days >= 1 AND lookahead_days <= 365),
  timezone VARCHAR(64) NOT NULL DEFAULT 'America/Toronto',
  working_days JSONB NOT NULL DEFAULT '[1,2,3,4,5]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO booking_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

UPDATE services SET duration_minutes = 90
WHERE name IN ('Smoke & Carbon Monoxide Alarms', 'Sockets, Outlets & Switches');

UPDATE services SET duration_minutes = 120
WHERE name IN (
  'Electrical Troubleshooting & Repairs',
  'Ceiling Fan & Fixture Installation',
  'Dedicated Circuits',
  'Electrical Maintenance Calls',
  'Troubleshooting & Repairs'
);

UPDATE services SET duration_minutes = 180
WHERE name IN (
  'Indoor & Outdoor Lighting',
  'Enhanced Home Safety Installations',
  'Smart Home Installations',
  'Commercial Lighting',
  'Emergency Lighting'
);

UPDATE services SET duration_minutes = 240
WHERE name IN (
  'EV Charger Installation',
  'Transformer Installation & Service',
  'Parking Lot Lighting',
  'Panel & Service Upgrades'
);

UPDATE services SET duration_minutes = 360
WHERE name IN (
  'Generator Installation',
  'Renovation & Addition Wiring',
  'Tenant Improvement Wiring',
  'Dedicated Circuits & Equipment Wiring'
);

UPDATE services SET duration_minutes = 480
WHERE name IN (
  'Panel Upgrades & Installation',
  'Basement Wiring',
  'Home Rewiring',
  'Custom Home Wiring',
  'New Commercial Rough-Ins'
);
