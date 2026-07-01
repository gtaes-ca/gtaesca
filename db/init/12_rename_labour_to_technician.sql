ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check;
ALTER TABLE team_invitations DROP CONSTRAINT IF EXISTS team_invitations_user_type_check;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

UPDATE bookings SET status = 'technician_assigned' WHERE status = 'labour_assigned';
UPDATE users SET user_type = 'technician' WHERE user_type = 'labour_team';
UPDATE users SET role = 'technician' WHERE user_type = 'technician' AND role IN ('team_member', 'labour_team_member');
UPDATE team_invitations SET user_type = 'technician' WHERE user_type = 'labour_team';

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'labour_user_id'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN labour_user_id TO technician_user_id;
  END IF;
END $$;

ALTER INDEX IF EXISTS idx_bookings_labour_user_id RENAME TO idx_bookings_technician_user_id;
CREATE INDEX IF NOT EXISTS idx_bookings_technician_user_id ON bookings(technician_user_id);

DO $$ BEGIN
  IF to_regclass('public.labour_profiles') IS NOT NULL THEN
    ALTER TABLE labour_profiles RENAME TO technician_profiles;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public.labour_expertise') IS NOT NULL THEN
    ALTER TABLE labour_expertise RENAME TO technician_expertise;
  END IF;
END $$;

ALTER TABLE users ADD CONSTRAINT users_user_type_check
  CHECK (user_type IN ('super_admin', 'operation_team', 'technician', 'customer'));

ALTER TABLE team_invitations ADD CONSTRAINT team_invitations_user_type_check
  CHECK (user_type IN ('operation_team', 'technician'));

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'technician_assigned', 'completed', 'cancelled'));
