INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.legal', '/management/cms/legal', 'Legal Pages', 'cms', 'Website CMS', 126)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.legal'
ON CONFLICT DO NOTHING;

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'terms',
    'banner',
    '{
      "title": "Terms and Conditions",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'terms',
    'content',
    '{
      "title": "Terms and Conditions",
      "lastUpdated": "July 21, 2026",
      "introText": "These Terms and Conditions govern your use of the GTA Electric Services website and the booking of our electrical services. By accessing our website or requesting our services, you agree to these terms.",
      "sections": [
        {
          "id": "terms-1",
          "heading": "1. Services",
          "body": "GTA Electric Services provides residential and commercial electrical services in the Greater Toronto Area. Service availability, pricing, and scheduling are subject to confirmation at the time of booking."
        },
        {
          "id": "terms-2",
          "heading": "2. Bookings and Appointments",
          "body": "When you book a service, you agree to provide accurate contact details and property information. We reserve the right to reschedule or cancel appointments due to safety concerns, weather, technician availability, or incomplete access to the service location."
        },
        {
          "id": "terms-3",
          "heading": "3. Pricing and Payment",
          "body": "Quoted prices are estimates unless confirmed as fixed-price in writing. Final charges may vary based on materials required, code compliance work, and conditions discovered during inspection or service. Payment terms will be communicated before work begins whenever possible."
        },
        {
          "id": "terms-4",
          "heading": "4. Cancellations",
          "body": "Please provide reasonable notice if you need to cancel or reschedule an appointment. Repeated missed appointments or late cancellations may result in fees or refusal of future service."
        },
        {
          "id": "terms-5",
          "heading": "5. Limitation of Liability",
          "body": "To the fullest extent permitted by law, GTA Electric Services is not liable for indirect, incidental, or consequential damages arising from the use of our website or services. Our liability for any claim is limited to the amount paid for the specific service giving rise to the claim."
        },
        {
          "id": "terms-6",
          "heading": "6. Contact",
          "body": "If you have questions about these Terms and Conditions, please contact us through the contact page on this website."
        }
      ]
    }'::jsonb
  ),
  (
    'privacy',
    'banner',
    '{
      "title": "Privacy Policy",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'privacy',
    'content',
    '{
      "title": "Privacy Policy",
      "lastUpdated": "July 21, 2026",
      "introText": "This Privacy Policy explains how GTA Electric Services collects, uses, and protects personal information when you visit our website, create an account, or book our services.",
      "sections": [
        {
          "id": "privacy-1",
          "heading": "1. Information We Collect",
          "body": "We may collect your name, email address, phone number, service address, booking details, account credentials, and communications you send to us through forms, email, or phone."
        },
        {
          "id": "privacy-2",
          "heading": "2. How We Use Information",
          "body": "We use personal information to respond to inquiries, process bookings, deliver services, send service-related notifications, improve our website, and comply with legal obligations."
        },
        {
          "id": "privacy-3",
          "heading": "3. Information Sharing",
          "body": "We do not sell your personal information. We may share information with service providers that help us operate our website, process communications, or deliver services, and when required by law."
        },
        {
          "id": "privacy-4",
          "heading": "4. Data Security",
          "body": "We use reasonable administrative, technical, and organizational safeguards to protect personal information. No method of transmission or storage is completely secure."
        },
        {
          "id": "privacy-5",
          "heading": "5. Your Choices",
          "body": "You may contact us to update account information or request deletion of personal information, subject to legal and operational requirements related to completed bookings and records."
        },
        {
          "id": "privacy-6",
          "heading": "6. Contact",
          "body": "If you have questions about this Privacy Policy or how we handle personal information, please contact us through the contact page on this website."
        }
      ]
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
