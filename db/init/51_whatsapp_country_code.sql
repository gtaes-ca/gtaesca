-- wa.me reads a 10-digit number as a country code, so store the +1 prefix.
UPDATE booking_settings
SET company_whatsapp_number = '1' || regexp_replace(company_whatsapp_number, '\D', '', 'g'),
    updated_at = NOW()
WHERE company_whatsapp_number IS NOT NULL
  AND length(regexp_replace(company_whatsapp_number, '\D', '', 'g')) = 10;
