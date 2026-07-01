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
