CREATE TABLE IF NOT EXISTS booking_services (
  id SERIAL PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES services(id),
  duration_minutes INT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (booking_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_booking_services_booking_id ON booking_services(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_services_service_id ON booking_services(service_id);

INSERT INTO booking_services (booking_id, service_id, duration_minutes, price, sort_order)
SELECT b.id, b.service_id, b.duration_minutes, b.service_price, 0
FROM bookings b
WHERE NOT EXISTS (
  SELECT 1 FROM booking_services bs WHERE bs.booking_id = b.id
);
