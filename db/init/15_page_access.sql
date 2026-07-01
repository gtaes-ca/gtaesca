CREATE TABLE IF NOT EXISTS admin_pages (
  key VARCHAR(80) PRIMARY KEY,
  path VARCHAR(255) NOT NULL,
  label VARCHAR(120) NOT NULL,
  group_key VARCHAR(80) NOT NULL,
  group_label VARCHAR(120) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS role_page_access (
  role VARCHAR(30) NOT NULL,
  page_key VARCHAR(80) NOT NULL REFERENCES admin_pages(key) ON DELETE CASCADE,
  PRIMARY KEY (role, page_key)
);

INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('dashboard.analytics', '/dashboard/analytics', 'Dashboard', 'general', 'General', 10),
  ('management.invitations', '/management/invitations', 'Team Invitations', 'team', 'Team', 20),
  ('management.users', '/management/users', 'User Management', 'team', 'Team', 30),
  ('management.customers', '/management/customers', 'Online Customers', 'customers', 'Customers', 40),
  ('management.service-categories', '/management/service-categories', 'Service Categories', 'services', 'Services', 50),
  ('management.services', '/management/services', 'Services', 'services', 'Services', 60),
  ('management.materials', '/management/materials', 'Materials', 'services', 'Services', 70),
  ('management.service-locations', '/management/service-locations', 'Service Locations', 'locations', 'Service Locations', 80),
  ('management.bookings', '/management/bookings', 'Bookings', 'bookings', 'Bookings', 90),
  ('management.booking-settings', '/management/booking-settings', 'Booking Settings', 'bookings', 'Bookings', 100),
  ('technician.jobs', '/technician/jobs', 'My Jobs', 'technician', 'Technician', 110)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', key FROM admin_pages
ON CONFLICT DO NOTHING;

INSERT INTO role_page_access (role, page_key) VALUES
  ('support', 'dashboard.analytics'),
  ('support', 'management.customers'),
  ('support', 'management.bookings'),
  ('viewer', 'dashboard.analytics'),
  ('technician', 'technician.jobs')
ON CONFLICT DO NOTHING;
