# GTA Electric Services — Client Update

**Date:** July 24, 2026

Summary of website and admin updates delivered today:

- Added a **Call Now** button on the home hero that dials the company mobile number from Booking Settings.
- Moved the hero slider pagination dots to the middle-right of the banner for clearer slide navigation.
- Renamed the WhatsApp booking action to **Request a Quote** (instead of “Book via WhatsApp”).
- Added a **Call Now** button in the site header next to Request a Quote.
- Routed **Request a Quote** to the contact page quote form when WhatsApp booking mode is enabled.
- Contact form submissions now open WhatsApp with a pre-filled quote message.
- Removed the separate “Book your service via WhatsApp” block from the contact page (quote form handles this flow).
- Moved **Contact Details** editing (phone, email, address, social links) into the Contact CMS section for easier management.
- Synced contact phone, email, and address across the header top bar, footer, and contact areas sitewide from one source.
- Launched dedicated **Residential** and **Commercial** service pages with CMS-managed banners, details, and galleries.
- Updated the admin Services CMS so Residential and Commercial pages can be edited independently.
- Improved the homepage services gallery with equal image heights and centered section headings.
- Added social media icons under the hero call-to-action buttons.
- Tuned the hero banner height so it fills the screen cleanly below the header.
- Applied the brand navy and gold color system across key UI elements (top bar, hero overlay, CTAs, footer).
- Applied a stronger navy color overlay on the home hero banner.
- Applied the same navy overlay treatment to all inner page banners (About, Contact, Services, etc.).
- Switched the site font to **Roboto** for a cleaner, more consistent look.
- Refined heading and section title sizing for better readability across pages.
- Replaced the footer Hashmark logo with the light logo version for better contrast on the dark footer.
- Added a phone icon to **Call Now** and a right-arrow icon to **Request a Quote**.
- Matched **Call Now** and **Request a Quote** button sizes on the hero and in the header.
- Hero secondary button now uses **Request a Quote** (aligned with the header CTA).

### Deploy note (for your team)

- Database migrations **38** and **39** are required on the API/server so Residential and Commercial CMS content seeds correctly. No new database tables — these only add CMS widget content.
