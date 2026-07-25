INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'about',
    'intro',
    '{
      "tagline": "Who We Are",
      "title": "Built on Safety, Skill, and Service Across the GTA",
      "text1": "GTA Electric Services is a licensed electrical contractor serving homes and businesses throughout the Greater Toronto Area with clear communication and dependable workmanship.",
      "text2": "From panel upgrades and lighting to EV chargers and emergency repairs, our ESA-certified team focuses on code-compliant installs and honest recommendations.",
      "points": [
        "Licensed & insured electricians",
        "Residential and commercial expertise",
        "Transparent quotes with no hidden fees"
      ],
      "image": "assets/images/resources/about-one-img-1.jpg",
      "buttonText": "Request a Quote",
      "buttonLink": "/contact"
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
