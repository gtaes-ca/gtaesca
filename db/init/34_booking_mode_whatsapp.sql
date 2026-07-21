ALTER TABLE booking_settings
  ADD COLUMN IF NOT EXISTS booking_mode VARCHAR(16) NOT NULL DEFAULT 'full'
    CHECK (booking_mode IN ('full', 'whatsapp')),
  ADD COLUMN IF NOT EXISTS company_whatsapp_number VARCHAR(20);

UPDATE booking_settings
SET booking_mode = 'full'
WHERE id = 1 AND booking_mode IS NULL;
